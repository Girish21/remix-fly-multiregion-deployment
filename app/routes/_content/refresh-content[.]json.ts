import type { LoaderFunction } from "remix";
import { json } from "remix";
import { getContentState } from "~/model/content.server";

export const loader: LoaderFunction = async () => {
  const rows = await getContentState();

  return json(rows || {});
};
