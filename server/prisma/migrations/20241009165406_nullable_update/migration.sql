-- DropForeignKey
ALTER TABLE "Quote" DROP CONSTRAINT "Quote_folderId_fkey";

-- AlterTable
ALTER TABLE "Quote" ALTER COLUMN "folderId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Quote" ADD CONSTRAINT "Quote_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "Folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
