/*
  Warnings:

  - You are about to drop the `BuiltInTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CustomTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_BuiltInTagToQuote` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CustomTagToQuote` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "TagType" AS ENUM ('BUILTIN', 'CUSTOM');

-- DropForeignKey
ALTER TABLE "CustomTag" DROP CONSTRAINT "CustomTag_userId_fkey";

-- DropForeignKey
ALTER TABLE "_BuiltInTagToQuote" DROP CONSTRAINT "_BuiltInTagToQuote_A_fkey";

-- DropForeignKey
ALTER TABLE "_BuiltInTagToQuote" DROP CONSTRAINT "_BuiltInTagToQuote_B_fkey";

-- DropForeignKey
ALTER TABLE "_CustomTagToQuote" DROP CONSTRAINT "_CustomTagToQuote_A_fkey";

-- DropForeignKey
ALTER TABLE "_CustomTagToQuote" DROP CONSTRAINT "_CustomTagToQuote_B_fkey";

-- DropTable
DROP TABLE "BuiltInTag";

-- DropTable
DROP TABLE "CustomTag";

-- DropTable
DROP TABLE "_BuiltInTagToQuote";

-- DropTable
DROP TABLE "_CustomTagToQuote";

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TagType" NOT NULL,
    "userId" INTEGER,
    "color" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuoteToTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_userId_key" ON "Tag"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_QuoteToTag_AB_unique" ON "_QuoteToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_QuoteToTag_B_index" ON "_QuoteToTag"("B");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteToTag" ADD CONSTRAINT "_QuoteToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuoteToTag" ADD CONSTRAINT "_QuoteToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
