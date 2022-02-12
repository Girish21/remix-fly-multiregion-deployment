import type * as React from "react";
import {
  HeadersFunction,
  json,
  LinksFunction,
  LoaderFunction,
  MetaFunction,
  useLoaderData,
} from "remix";
import BlogList from "~/components/blog-list";
import { getMdxListItems } from "~/utils/mdx.server";
import { getSeo } from "~/utils/seo";

type LoaderData = { blogList: Awaited<ReturnType<typeof getMdxListItems>> };

const [seoMeta, seoLinks] = getSeo();

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
    { blogList: blogList.slice(0, 10) },
    { headers: { "cache-control": "private, max-age=60" } }
  );
};

export default function Index() {
  const { blogList } = useLoaderData<LoaderData>();

  return (
    <>
      <section className="max-w-4xl mx-auto">
        <div className="h-[calc(100vh-92px)] grid place-content-center">
          <h1 className="p-4 flex flex-col items-center">
            <GradientText>Remix</GradientText>
            <GradientText>Blog</GradientText>
          </h1>
        </div>
      </section>
      <section className="w-[90vw] mx-auto mt-32">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl text-gray-800 dark:text-gray-100">
            Recent Posts
          </h2>
          <BlogList blogList={blogList} />
        </div>
      </section>
    </>
  );
}

function GradientText(props: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className="text-center text-6xl leading-snug text-transparent bg-gradient-to-r from-sky-600 via-pink-500 to-red-600 dark:via-blue-400 dark:to-green-300 bg-clip-text"
      {...props}
    />
  );
}
