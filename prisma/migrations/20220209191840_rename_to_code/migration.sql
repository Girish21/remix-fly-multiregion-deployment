/*
  Warnings:

  - You are about to drop the column `content` on the `Content` table. All the data in the column will be lost.
  - Added the required column `code` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "contentDirectory" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "frontmatter" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "published" BOOLEAN NOT NULL,
    "requiresUpdate" BOOLEAN DEFAULT false
);
INSERT INTO "new_Content" ("contentDirectory", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt") SELECT "contentDirectory", "frontmatter", "id", "published", "requiresUpdate", "slug", "timestamp", "title", "updatedAt" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_slug_key" ON "Content"("slug");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
