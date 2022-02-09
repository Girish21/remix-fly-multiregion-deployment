import * as React from "react";
import type { LinksFunction, LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { getMDXComponent } from "mdx-bundler/client";
import { json } from "remix";
import invariant from "tiny-invariant";
import { getMdxPage } from "~/utils/mdx.server";
import type { MdxComponent } from "~/types";

import styles from "highlight.js/styles/night-owl.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

export const loader: LoaderFunction = async ({ params }) => {
  const slug = params.slug;
  invariant(typeof slug === "string", "Slug should be a string, and defined");

  const mdxPage = await getMdxPage({ contentDirectory: "blog", slug });

  if (!mdxPage) {
    throw json(null, { status: 404 });
  }

  return json<MdxComponent>(mdxPage, {
    headers: { "cache-control": "private, max-age: 60", Vary: "Cookie" },
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
