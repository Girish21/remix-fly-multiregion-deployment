import { Link } from "remix";
import type { getMdxListItems } from "~/utils/mdx.server";

type BlogItem = Awaited<ReturnType<typeof getMdxListItems>>[0];

export default function BlogItem({ description, slug, title }: BlogItem) {
  return (
    <Link prefetch="intent" to={`/blog/${slug}`} className="py-4">
      <li className="flex flex-col gap-2  max-w-[65ch]">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-50">
          {title}
        </h2>
        <p className="text-base text-gray-600 dark:text-gray-200">
          {description}
        </p>
        <div className="font-bold text-gray-800 text-base">Read more</div>
      </li>
    </Link>
  );
}
