/*
  Warnings:

  - You are about to alter the column `timestamp` on the `ContentState` table. The data in that column could be lost. The data in that column will be cast from `Int` to `DateTime`.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_ContentState" ("id", "key", "sha", "timestamp") SELECT "id", "key", "sha", "timestamp" FROM "ContentState";
DROP TABLE "ContentState";
ALTER TABLE "new_ContentState" RENAME TO "ContentState";
CREATE UNIQUE INDEX "ContentState_key_key" ON "ContentState"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
