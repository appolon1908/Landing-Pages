import { readFile, mkdir, writeFile, realpath, lstat } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { resolve, join } from "node:path";
import { execFileSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";
import { parseSiteContext } from "../../packages/core/src/contracts/site.ts";

const origin = "https://breero.com";
const base = "/srv/codestra/breero";
const locales = ["es", "en", "fr"];

export function createRelease({ revision, releaseDir, catalog, registry }) {
  if (
    !/^[a-f0-9]{40}$/.test(revision) ||
    releaseDir !== `${base}/releases/${revision}`
  )
    throw Error("Expected an immutable Breero release path and full revision.");
  if (
    !Array.isArray(catalog) ||
    catalog.length !== 30 ||
    catalog.some(
      (item, i) =>
        item.id !== i + 1 || !/^[a-z][a-z0-9-]{0,63}$/.test(item.slug),
    ) ||
    new Set(catalog.map((item) => item.slug)).size !== 30
  )
    throw Error("Expected the complete ordered canonical catalog.");
  if (
    registry.site.mode !== "preview" ||
    registry.destination.type !== "disabled"
  )
    throw Error(
      "Public website deployment requires preview mode and disabled intake.",
    );
  const publicRegistry = structuredClone(registry);
  publicRegistry.hosts = ["breero.com"];
  publicRegistry.site.publicOrigin = origin;
  publicRegistry.site.pages = catalog.map(({ slug }) => {
    const page = registry.site.pages.find((item) => item.slug === slug);
    if (!page) throw Error(`Missing site binding: ${slug}`);
    return { ...page, origin: null };
  });
  parseSiteContext({ ...publicRegistry.site, submissionsEnabled: false });
  const image = (slug) => `local/breero-${slug}:${revision}`;
  const labels = {
    "codestra.project": "breero-public",
    "codestra.release": revision,
  };
  const hardening = {
    user: "node",
    read_only: true,
    cap_drop: ["ALL"],
    security_opt: ["no-new-privileges:true"],
    pids_limit: 128,
    restart: "unless-stopped",
    networks: ["breero"],
    labels,
  };
  const services = {
    backend: {
      ...hardening,
      image: image("backend"),
      mem_limit: "256m",
      environment: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "4000",
        REGISTRY_DIR: "/app/config/registry",
      },
      volumes: [
        {
          type: "bind",
          source: `${releaseDir}/registry`,
          target: "/app/config/registry",
          read_only: true,
        },
      ],
    },
  };
  const pages = ["home", ...catalog.map((item) => item.slug)].map((slug, i) => {
    const port = 6100 + i;
    services[slug] = {
      ...hardening,
      image: image(slug),
      mem_limit: "192m",
      ports: [`127.0.0.1:${port}:4173`],
      environment: {
        NODE_ENV: "production",
        HOST: "0.0.0.0",
        PORT: "4173",
        BACKEND_URL: "http://backend:4000",
      },
      depends_on: { backend: { condition: "service_healthy" } },
    };
    return {
      slug,
      port,
      image: image(slug),
      routes: locales.flatMap((locale) =>
        slug === "home"
          ? [`/${locale}/`]
          : ["landing", "business"].map(
              (audience) => `/${locale}/${audience}/${slug}`,
            ),
      ),
    };
  });
  const compose = {
    name: "breero-public",
    services,
    networks: {
      breero: {
        name: "breero-public",
        driver: "bridge",
        labels: { "codestra.project": "breero-public" },
      },
    },
  };
  const caddy = `# Generated for ${revision}; import only after local checks and DNS confirmation.\nwww.breero.com {\n  redir https://breero.com{uri} permanent\n}\n\nbreero.com {\n  encode zstd gzip\n  header X-Robots-Tag "noindex, nofollow"\n  header X-Content-Type-Options nosniff\n  handle_path /assets/* {\n    root * ${base}/current/assets\n    header Cache-Control "public, max-age=31536000, immutable" {\n      match status 200 206 304\n    }\n    file_server\n  }\n${pages
    .slice(1)
    .map(
      ({ slug, port }, i) =>
        `  @page_${i} path_regexp page_${i} ^/(es|en|fr)/(landing|business)/${slug}(/thank-you)?/?$\n  handle @page_${i} {\n    reverse_proxy 127.0.0.1:${port}\n  }`,
    )
    .join("\n")}\n  handle {\n    reverse_proxy 127.0.0.1:6100\n  }\n}\n`;
  const release = {
    schemaVersion: 1,
    revision,
    releaseDir,
    sourceDir: `${releaseDir}/source`,
    origin,
    project: "breero-public",
    backendImage: image("backend"),
    mode: "preview",
    destination: "disabled",
    hostPortsLoopbackOnly: true,
    runtimeEgressBlocked: false,
    pages,
  };
  return { compose, caddy, registry: publicRegistry, release };
}

export async function validateSource(
  dir,
  revision,
  scriptRoot = fileURLToPath(new URL("../../", import.meta.url)),
) {
  for (const path of [dir, join(dir, "source")]) {
    if (
      (await lstat(path)).isSymbolicLink() ||
      (await realpath(path)) !== resolve(path)
    )
      throw Error(
        "Release and source must be canonical paths without symlink escapes.",
      );
  }
  if ((await realpath(join(dir, "source"))) !== (await realpath(scriptRoot)))
    throw Error("Run this generator from the release's own source checkout.");
  const git = (...args) =>
    execFileSync("git", ["-C", join(dir, "source"), ...args], {
      encoding: "utf8",
    }).trim();
  if (git("rev-parse", "HEAD") !== revision)
    throw Error("Source revision does not match release revision.");
  if (git("status", "--porcelain"))
    throw Error("Source checkout must be clean.");
}

export async function verifyFiles(dir, expected) {
  for (const name of [
    "registry",
    "registry/breero.json",
    "compose.json",
    "release.json",
    "Caddyfile",
  ]) {
    const path = join(dir, name);
    if (
      (await lstat(path)).isSymbolicLink() ||
      (await realpath(path)) !== resolve(path)
    )
      throw Error(
        `Configuration path must be canonical without symlinks: ${name}`,
      );
  }
  for (const [name, value] of [
    ["compose.json", expected.compose],
    ["registry/breero.json", expected.registry],
    ["release.json", expected.release],
  ]) {
    if (
      !isDeepStrictEqual(
        JSON.parse(await readFile(join(dir, name), "utf8")),
        value,
      )
    )
      throw Error(`Release configuration differs from trusted source: ${name}`);
  }
  if ((await readFile(join(dir, "Caddyfile"), "utf8")) !== expected.caddy)
    throw Error("Caddyfile differs from trusted source.");
}

export async function writeRelease(options) {
  const result = createRelease(options);
  const dir = options.releaseDir;
  await validateSource(dir, options.revision);
  for (const path of [
    "compose.json",
    "Caddyfile",
    "release.json",
    "registry",
  ]) {
    try {
      await lstat(`${dir}/${path}`);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }
    throw Error(
      `Refusing to overwrite existing release configuration: ${path}`,
    );
  }
  await mkdir(`${dir}/registry`);
  for (const [name, value] of [
    ["compose.json", result.compose],
    ["registry/breero.json", result.registry],
    ["release.json", result.release],
  ])
    await writeFile(`${dir}/${name}`, `${JSON.stringify(value, null, 2)}\n`, {
      flag: "wx",
      mode: 0o644,
    });
  await writeFile(`${dir}/Caddyfile`, result.caddy, {
    flag: "wx",
    mode: 0o644,
  });
  return result.release;
}

if (
  process.argv[1] &&
  pathToFileURL(process.argv[1]).href === import.meta.url
) {
  const { values } = parseArgs({
    options: {
      revision: { type: "string" },
      release: { type: "string" },
      verify: { type: "boolean" },
    },
  });
  const registry = JSON.parse(
    await readFile(
      new URL("../../config/registry/breero-preview.json", import.meta.url),
      "utf8",
    ),
  );
  const catalog = JSON.parse(
    await readFile(
      new URL(
        "../../docs/missions/inputs/service-content-map.json",
        import.meta.url,
      ),
      "utf8",
    ),
  ).services;
  const options = {
    revision: values.revision,
    releaseDir: values.release,
    catalog,
    registry,
  };
  if (values.verify) {
    const expected = createRelease(options);
    await validateSource(values.release, values.revision);
    await verifyFiles(values.release, expected);
    console.log(JSON.stringify(expected.release));
  } else {
    const release = await writeRelease(options);
    console.log(
      JSON.stringify({
        generated: release.releaseDir,
        pages: release.pages.length,
        submissionsEnabled: false,
      }),
    );
  }
}
