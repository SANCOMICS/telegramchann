/*
  Warnings:

  - Made the column `content` on table `Message` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "author" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "mediaUrl" TEXT,
    "type" TEXT NOT NULL DEFAULT 'text',
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reactMindBlown" INTEGER NOT NULL DEFAULT 0,
    "reactFire" INTEGER NOT NULL DEFAULT 0,
    "reactHundred" INTEGER NOT NULL DEFAULT 0,
    "reactFlex" INTEGER NOT NULL DEFAULT 0,
    "reactDash" INTEGER NOT NULL DEFAULT 0,
    "reactHeart" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Message" ("author", "content", "createdAt", "id", "mediaUrl", "reactDash", "reactFire", "reactFlex", "reactHeart", "reactHundred", "reactMindBlown", "type", "views") SELECT "author", "content", "createdAt", "id", "mediaUrl", "reactDash", "reactFire", "reactFlex", "reactHeart", "reactHundred", "reactMindBlown", "type", "views" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
