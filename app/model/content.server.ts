import db from "~/utils/db.server";

export async function getContentState() {
  const rows = await db.contentState.findUnique({
    select: { sha: true, timestamp: true },
    where: { key: "content-state" },
  });

  return rows;
}
