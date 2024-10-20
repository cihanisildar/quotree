/*
  Warnings:

  - You are about to drop the column `backgroundImage` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `height` on the `Quote` table. All the data in the column will be lost.
  - You are about to drop the column `width` on the `Quote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Quote" DROP COLUMN "backgroundImage",
DROP COLUMN "height",
DROP COLUMN "width";
