/*
  Warnings:

  - A unique constraint covering the columns `[contentDirectory,slug]` on the table `Content` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Content_contentDirectory_slug_idx";

-- CreateIndex
CREATE UNIQUE INDEX "Content_contentDirectory_slug_key" ON "Content"("contentDirectory", "slug");
