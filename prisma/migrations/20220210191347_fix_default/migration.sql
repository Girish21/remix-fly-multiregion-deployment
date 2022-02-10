-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ContentState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL
);
INSERT INTO "new_ContentState" ("id", "key", "sha", "timestamp") SELECT "id", "key", "sha", "timestamp" FROM "ContentState";
DROP TABLE "ContentState";
ALTER TABLE "new_ContentState" RENAME TO "ContentState";
CREATE UNIQUE INDEX "ContentState_key_key" ON "ContentState"("key");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
