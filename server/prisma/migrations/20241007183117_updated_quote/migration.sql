/*
  Warnings:

  - Added the required column `height` to the `Quote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `width` to the `Quote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Quote" ADD COLUMN     "backgroundImage" TEXT,
ADD COLUMN     "height" INTEGER NOT NULL,
ADD COLUMN     "width" INTEGER NOT NULL;
