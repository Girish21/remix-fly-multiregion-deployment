import { Link, LoaderFunction, useLoaderData } from "remix";
import { json } from "remix";
import { getMdxListItems } from "~/utils/mdx.server";

type LoaderData = Awaited<ReturnType<typeof getMdxListItems>>;

export const loader: LoaderFunction = async () => {
  const blogList = await getMdxListItems({ contentDirectory: "blog" });

  return json<LoaderData>(blogList, {
    headers: { "cache-control": "private, max-age=60", Vary: "Cookie" },
  });
};

export default function () {
  const data = useLoaderData<LoaderData>();

  return (
    <section>
      <ol>
        {data.map(({ id, slug, title }) => (
          <Link key={id} prefetch="intent" to={`/blog/${slug}`}>
            <li>{title}</li>
          </Link>
        ))}
      </ol>
    </section>
  );
}
