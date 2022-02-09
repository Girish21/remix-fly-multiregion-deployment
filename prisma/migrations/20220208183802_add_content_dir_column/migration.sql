/*
  Warnings:

  - Added the required column `contentDirectory` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDirectory" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "frontmatter" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL,
    "requiresUpdate" BOOLEAN DEFAULT false
);
INSERT INTO "new_Content" ("content", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt") SELECT "content", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
