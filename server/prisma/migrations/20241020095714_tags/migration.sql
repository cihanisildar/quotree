-- CreateTable
CREATE TABLE "BuiltInTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BuiltInTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BuiltInTagToQuote" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_CustomTagToQuote" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "BuiltInTag_name_key" ON "BuiltInTag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "CustomTag_name_userId_key" ON "CustomTag"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "_BuiltInTagToQuote_AB_unique" ON "_BuiltInTagToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_BuiltInTagToQuote_B_index" ON "_BuiltInTagToQuote"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CustomTagToQuote_AB_unique" ON "_CustomTagToQuote"("A", "B");

-- CreateIndex
CREATE INDEX "_CustomTagToQuote_B_index" ON "_CustomTagToQuote"("B");

-- AddForeignKey
ALTER TABLE "CustomTag" ADD CONSTRAINT "CustomTag_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltInTagToQuote" ADD CONSTRAINT "_BuiltInTagToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "BuiltInTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BuiltInTagToQuote" ADD CONSTRAINT "_BuiltInTagToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomTagToQuote" ADD CONSTRAINT "_CustomTagToQuote_A_fkey" FOREIGN KEY ("A") REFERENCES "CustomTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CustomTagToQuote" ADD CONSTRAINT "_CustomTagToQuote_B_fkey" FOREIGN KEY ("B") REFERENCES "Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;
