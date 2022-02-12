import type {
  HeadersFunction,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from "remix";
import { json, useLoaderData } from "remix";

import BlogList from "~/components/blog-list";
import { getMdxListItems } from "~/utils/mdx.server";
import { getSeo } from "~/utils/seo";

type LoaderData = { blogList: Awaited<ReturnType<typeof getMdxListItems>> };

const [seoMeta, seoLinks] = getSeo({
  title: "Blogs",
  description: "Awesome blogs!",
  twitter: {
    title: "Blogs",
    description: "Awesome blogs!",
  },
});

export const meta: MetaFunction = () => {
  return { ...seoMeta };
};

export const links: LinksFunction = () => {
  return [...seoLinks];
};

export const headers: HeadersFunction = ({ loaderHeaders }) => {
  return {
    "cache-control":
      loaderHeaders.get("cache-control") ?? "private, max-age=60",
    Vary: "Cookie",
  };
};

export const loader: LoaderFunction = async () => {
  const blogList = await getMdxListItems({ contentDirectory: "blog" });

  return json<LoaderData>(
    { blogList },
    {
      headers: { "cache-control": "private, max-age=60", Vary: "Cookie" },
    }
  );
};

export default function () {
  const { blogList } = useLoaderData<LoaderData>();

  return (
    <section className="max-w-4xl min-h-screen pt-24 mx-auto">
      <BlogList blogList={blogList} />
    </section>
  );
}
