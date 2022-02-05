/*
  Warnings:

  - You are about to drop the `Deployment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Deployment";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "ContentState" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "sha" TEXT NOT NULL,
    "timestamp" INTEGER NOT NULL
);
