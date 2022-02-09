import * as React from "react";
import type { LoaderFunction } from "remix";
import { json, useLoaderData } from "remix";
import { getMDXComponent } from "mdx-bundler/client";
import { getMdxPage } from "~/utils/mdx.server";
import type { MdxComponent } from "~/types";

export const loader: LoaderFunction = async () => {
  const mdxPage = await getMdxPage({
    contentDirectory: "pages",
    slug: "about",
  });

  if (!mdxPage) {
    throw json(null, 404);
  }

  return json<MdxComponent>(mdxPage, {
    headers: { "cache-control": "private, max-age: 60", vary: "cookie" },
  });
};

export default function () {
  const data = useLoaderData<MdxComponent>();

  const Component = React.useMemo(() => getMDXComponent(data.code), [data]);

  return (
    <main>
      <Component />
    </main>
  );
}
