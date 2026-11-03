/** Development destination: prints the submission and accepts it. */
export function log(config) {
  const sink = config.sink ?? ((line) => console.log(line));
  return {
    type: "log",
    async deliver(submission) {
      sink(JSON.stringify({ event: "submission", ...submission }));
      return { downstreamStatus: "LOGGED" };
    },
  };
}
