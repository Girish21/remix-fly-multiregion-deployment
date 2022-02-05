const { fetchJSON, getChangedFiles } = require("./utils");

async function go() {
  const buildInfo = await fetchJSON(
    "https://remix-fly-region-test.fly.dev/build/build-info.json"
  );
  const previousCommitSHA = buildInfo.data.sha;
  const currentCommitSHA = process.env.GITHUB_SHA;
  const changes = getChangedFiles(previousCommitSHA, currentCommitSHA);

  const isDeployable =
    changes === null ||
    changes.length === 0 ||
    changes.some(({ filename }) => !filename.startsWith("content"));

  console.error(isDeployable ? "🟢 Deploy" : "🔴 Skip Deployment");

  console.log(isDeployable);
}

go().catch((error) => {
  console.error(error);
  console.log(true);
});
