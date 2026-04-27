-- Add display metrics for the store detail header and store news cards.
ALTER TABLE "Store" ADD COLUMN "followerCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StoreNews" ADD COLUMN "likeCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "StoreNews" ADD COLUMN "viewCount" INTEGER NOT NULL DEFAULT 0;
