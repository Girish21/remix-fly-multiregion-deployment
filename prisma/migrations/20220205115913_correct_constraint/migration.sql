/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `ContentState` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ContentState_key_key" ON "ContentState"("key");
