import db from "~/utils/db.server";

export async function setContentSHA(sha: string) {
  return db.contentState.upsert({
    where: { key: "content" },
    create: { sha, key: "content" },
    update: { sha },
  });
}
