/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Pass` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Pass_username_key" ON "Pass"("username");
