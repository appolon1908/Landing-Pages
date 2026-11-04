/** JSON data in an inert script, never executable code or raw HTML. */
export function renderSiteBootstrap(hostname, site) {
  const json = JSON.stringify({ hostname, site }).replace(
    /[<>&\u2028\u2029]/g,
    (character) =>
      `\\u${character.charCodeAt(0).toString(16).padStart(4, "0")}`,
  );
  return `<script id="lp-site-context" type="application/json">${json}</script>`;
}
