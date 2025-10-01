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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Carry over existing rows
INSERT INTO "new_Message" ("id", "author", "content", "createdAt")
SELECT "id", "author", "content", "createdAt" FROM "Message";

DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
