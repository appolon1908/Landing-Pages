import http from "node:http";

/** fetch() drops a custom Host header, so tests call the backend with node:http. */
export function call(
  base,
  path,
  { method = "GET", body, headers = {}, host = "fixture.example.org" } = {},
) {
  return new Promise((resolve, reject) => {
    const payload =
      body === undefined
        ? null
        : typeof body === "string"
          ? body
          : JSON.stringify(body);
    const req = http.request(
      new URL(path, base),
      {
        method,
        headers: {
          ...(payload ? { "Content-Type": "application/json" } : {}),
          ...headers,
          host,
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () =>
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text: data,
            json: () => JSON.parse(data),
          }),
        );
      },
    );
    req.on("error", reject);
    if (payload) req.write(payload);
    req.end();
  });
}
