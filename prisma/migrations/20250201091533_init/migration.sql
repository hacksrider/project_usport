/*
  Warnings:

  - You are about to drop the column `buying_date` on the `orders` table. All the data in the column will be lost.
  - Added the required column `buying_date` to the `buying_exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `buying_exercise` ADD COLUMN `buying_date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `buying_date`;
