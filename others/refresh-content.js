const { fetchJSON, getChangedFiles, postJSON } = require("./utils");

async function go() {
  const compareSha = process.env.GITHUB_SHA;

  const shaInfo = await fetchJSON(
    "https://remix-fly-region-test.fly.dev/_content/refresh-content.json"
  );
  let sha = shaInfo?.sha;

  if (!sha) {
    const buildInfo = await fetchJSON(
      "https://remix-fly-region-test.fly.dev/build/info.json"
    );
    sha = buildInfo.data.sha;
  }

  if (!sha) {
    console.error("Not sure what to refresh 🤷🏻‍♂️");
    return;
  }

  const changedFiles = getChangedFiles(sha, compareSha) ?? [];
  const contentPaths = changedFiles
    .filter(({ filename }) => filename.startsWith("content"))
    .map(({ filename }) => filename.replace(/^content\//, ""));

  if (contentPaths && contentPaths.length > 0) {
    console.error("Content changed. Refreshing content 💿", {
      currentSHA: compareSha,
      sha,
      contentPaths,
    });

    const response = await postJSON({ paths: contentPaths, sha: compareSha });

    console.error("Content refreshed 🚀", { response });
  } else {
    console.error("Nothing to refresh ✨");
  }
}

go().catch((error) => {
  console.error(error);
});
