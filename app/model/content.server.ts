import db from "~/utils/db.server";
import { getQueue } from "~/utils/p-queue.server";

export async function getContentState() {
  const rows = await db.contentState.findUnique({
    select: { sha: true, timestamp: true },
    where: { key: "content-state" },
  });

  return rows;
}

export async function getMdxCount(contentDirectory: string) {
  const count = await db.content.aggregate({
    _count: { _all: true },
    where: { published: true, contentDirectory },
  });

  return count._count._all;
}

export async function requiresUpdate(contentDirectory: string) {
  const requiresUpdateCount = await db.content.aggregate({
    _count: { requiresUpdate: true },
    where: { published: true, contentDirectory },
  });

  if (requiresUpdateCount._count.requiresUpdate === 0) {
    return null;
  }

  const requiresUpdate = await db.content.findMany({
    where: { requiresUpdate: true },
  });

  return requiresUpdate;
}

export async function getContentList(contentDirectory = "blog") {
  const contents = await db.content.findMany({
    where: { published: true, contentDirectory },
    select: { slug: true, title: true, id: true, timestamp: true },
    orderBy: { timestamp: "desc" },
  });

  return contents;
}

export async function getContent(slug: string) {
  const content = await db.content.findUnique({ where: { slug } });

  if (!content) {
    return null;
  }

  return {
    ...content,
    frontmatter: JSON.parse(content.frontmatter) as Record<string, unknown>,
  };
}

async function setRequiresUpdateImpl({
  slug,
  contentDirectory,
}: {
  slug: string;
  contentDirectory: string;
}) {
  await db.content.upsert({
    where: { slug },
    create: {
      requiresUpdate: true,
      slug,
      code: "",
      contentDirectory,
      frontmatter: "",
      published: true,
      title: "",
    },
    update: {
      requiresUpdate: true,
    },
  });
}

export async function setRequiresUpdate(
  ...params: Parameters<typeof setRequiresUpdateImpl>
) {
  const queue = await getQueue();
  const result = await queue.add(() => setRequiresUpdateImpl(...params));
  return result;
}

async function upsertContentImpl({
  contentDirectory,
  slug,
  title,
  code,
  published,
  frontmatter,
  timestamp,
}: {
  contentDirectory: string;
  slug: string;
  title: string;
  code: string;
  published: boolean;
  frontmatter: Record<string, unknown>;
  timestamp: Date;
}) {
  await db.content.upsert({
    where: { slug },
    update: {
      code,
      frontmatter: JSON.stringify(frontmatter),
      published,
      title,
      requiresUpdate: false,
    },
    create: {
      contentDirectory,
      code,
      frontmatter: JSON.stringify(frontmatter),
      published,
      slug,
      title,
      timestamp,
    },
  });
}

export async function upsertContent(
  ...params: Parameters<typeof upsertContentImpl>
) {
  const queue = await getQueue();

  const result = await queue.add(() => upsertContentImpl(...params));

  return result;
}
