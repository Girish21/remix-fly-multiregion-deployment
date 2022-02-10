import type { ActionFunction } from "remix";
import { json } from "remix";
import nodepath from "path";
import { setRequiresUpdate } from "~/model/content.server";
import { getMdxListItems } from "~/utils/mdx.server";
import { setContentSHA } from "~/model/content-state.server";

type Body = {
  paths: Array<string>;
  sha: string;
};

export const action: ActionFunction = async ({ request }) => {
  if (request.headers.get("auth") !== process.env.REFRESH_TOKEN) {
    return json({ message: "Not Authorised" }, { status: 401 });
  }

  const body = (await request.json()) as Body;

  if ("paths" in body && Array.isArray(body.paths)) {
    const refreshPaths = [];
    for (const path of body.paths) {
      const [contentDirectory, dirOrFile] = path.split("/");
      if (!contentDirectory || !dirOrFile) {
        return;
      }
      const slug = nodepath.parse(dirOrFile).name;
      await setRequiresUpdate({ slug, contentDirectory });

      refreshPaths.push(path);
    }
    if (refreshPaths.some((p) => p.startsWith("blog"))) {
      void getMdxListItems({ contentDirectory: "blog" });
    }
    if (refreshPaths.some((p) => p.startsWith("pages"))) {
      void getMdxListItems({ contentDirectory: "pages" });
    }
    if ("sha" in body) {
      void setContentSHA(body.sha);
    }

    return json({
      sha: body.sha,
      refreshPaths,
      message: "refreshing content paths",
    });
  }

  return json({ message: "no action" }, { status: 400 });
};
