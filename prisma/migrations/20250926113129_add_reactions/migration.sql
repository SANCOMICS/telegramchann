-- Add reaction columns to Message
ALTER TABLE "Message" ADD COLUMN "reactMindBlown" INTEGER NOT NULL DEFAULT 0; -- 🤯
ALTER TABLE "Message" ADD COLUMN "reactFire"      INTEGER NOT NULL DEFAULT 0; -- 🔥
ALTER TABLE "Message" ADD COLUMN "reactHundred"   INTEGER NOT NULL DEFAULT 0; -- 💯
ALTER TABLE "Message" ADD COLUMN "reactFlex"      INTEGER NOT NULL DEFAULT 0; -- 💪
ALTER TABLE "Message" ADD COLUMN "reactDash"      INTEGER NOT NULL DEFAULT 0; -- 💨
ALTER TABLE "Message" ADD COLUMN "reactHeart"     INTEGER NOT NULL DEFAULT 0; -- ❤️
