const execSync = require("child_process").execSync;
const http = require("https");

async function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res
        .on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        })
        .on("error", (error) => {
          reject(error);
        });
    });
  });
}

function getChangedFiles(sha, compareSha) {
  try {
    const pattern = /^(?<change>\w).*?\s+(?<filename>.+$)/;

    const diff = execSync(
      `git diff --name-status ${sha} ${compareSha}`
    ).toString();

    const changedFiles = diff
      .split("\n")
      .map((line) => line.match(pattern)?.groups)
      .filter(Boolean);

    const changes = [];
    for (const { change, filename } of changedFiles) {
      changes.push({ change, filename });
    }

    return changes;
  } catch (e) {
    console.error(e);
    return null;
  }
}

module.exports = { fetchJSON, getChangedFiles };
