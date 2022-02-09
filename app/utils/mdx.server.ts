import type { Content } from "@prisma/client";
import {
  getContent,
  getContentList,
  getMdxCount,
  requiresUpdate,
  upsertContent as upsertContentImpl,
} from "~/model/content.server";
import type { MdxPage } from "~/types";
import { compileMdx } from "./compile-mdx.server";
import { downloadDirectoryList, downloadMdxOrDirectory } from "./github.server";

async function dirList(dir: string) {
  const basePath = `content/${dir}`;
  const dirList = await downloadDirectoryList(basePath);

  return dirList.map(({ name, path }) => {
    return {
      name,
      slug: path.replace(`${basePath}/`, "").replace(/.mdx?$/, ""),
    };
  });
}

async function downloadMdx(
  filesList: Array<{ slug: string }>,
  contentDir: string
) {
  return Promise.all(
    filesList.map(async ({ slug }) => {
      const path = `${contentDir}/${slug}`;

      return {
        ...(await downloadMdxOrDirectory(path)),
        path,
        slug,
      };
    })
  );
}

async function compileMdxPages(pages: Awaited<ReturnType<typeof downloadMdx>>) {
  return Promise.all(
    pages.map(async ({ files, slug }) => {
      const compiledPage = await compileMdx<MdxPage["frontmatter"]>({
        files,
        slug,
      });

      if (!compiledPage) {
        return null;
      }

      return {
        ...compiledPage,
        slug,
      };
    })
  );
}

async function upsertContent(
  compiledPages: Awaited<ReturnType<typeof compileMdxPages>>,
  contentDirectory: string
) {
  return Promise.all(
    compiledPages.map((compiledPage) => {
      if (compiledPage) {
        return upsertContentImpl({
          contentDirectory,
          code: compiledPage.code,
          frontmatter: compiledPage.frontmatter,
          published: compiledPage.frontmatter.published ?? false,
          slug: compiledPage.slug,
          title: compiledPage.frontmatter.title ?? "",
          timestamp: new Date(compiledPage.frontmatter.date ?? ""),
        });
      }
      return null;
    })
  );
}

async function populateMdx(contentDirectory: string) {
  const filesList = await dirList(contentDirectory);
  const pages = await downloadMdx(filesList, contentDirectory);
  const compiledPages = await compileMdxPages(pages);
  await upsertContent(compiledPages, contentDirectory);
}

async function updateMdx(mdxToUpdate: Content[], contentDirectory: string) {
  const pages = await downloadMdx(mdxToUpdate, contentDirectory);
  const compiledPages = await compileMdxPages(pages);
  await upsertContent(compiledPages, contentDirectory);
}

export async function getMdxListItems({
  contentDirectory,
}: {
  contentDirectory: string;
}) {
  const [count, pagesToUpdates] = await Promise.all([
    getMdxCount(contentDirectory),
    requiresUpdate(contentDirectory),
  ]);

  if (count === 0) {
    await populateMdx(contentDirectory);
  }
  if (pagesToUpdates && pagesToUpdates.length > 0) {
    await updateMdx(pagesToUpdates, contentDirectory);
  }
  return getContentList();
}

export async function getMdxPage({
  slug,
  contentDirectory,
}: {
  slug: string;
  contentDirectory: string;
}) {
  const data = await getContent(slug);

  if (data && !data.requiresUpdate) {
    return data;
  }

  if (!data || data.requiresUpdate) {
    const pages = await downloadMdx([{ slug }], contentDirectory);
    const compiledPages = await compileMdxPages(pages);
    await upsertContent(compiledPages, contentDirectory);

    return getContent(slug);
  }
}
