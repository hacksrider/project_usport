/*
  Warnings:

  - You are about to alter the column `unit` on the `price_exercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.

*/
-- AlterTable
ALTER TABLE `price_exercise` MODIFY `unit` VARCHAR(10) NOT NULL;
