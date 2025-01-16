/*
  Warnings:

  - Added the required column `unit` to the `Price_Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `price_exercise` ADD COLUMN `unit` VARCHAR(191) NOT NULL;
