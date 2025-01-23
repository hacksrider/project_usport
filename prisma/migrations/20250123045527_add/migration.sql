/*
  Warnings:

  - Added the required column `units` to the `buying_exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buying_exercise` ADD COLUMN `units` VARCHAR(10) NOT NULL;
