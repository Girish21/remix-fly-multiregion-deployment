import type { LoaderFunction } from "remix";
import { json } from "remix";
import client from "~/utils/db.server";

export const loader: LoaderFunction = async () => {
  const data = await client.deployment.findUnique({
    where: { id: 1 },
    select: { sha: true, timestamp: true },
  });

  if (!data) {
    const message = { message: "No data available" };
    return json(message, {
      headers: {
        "Content-Length": String(Buffer.byteLength(JSON.stringify(message))),
      },
    });
  }
};
