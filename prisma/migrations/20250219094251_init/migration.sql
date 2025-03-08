/*
  Warnings:

  - Added the required column `page_about_id` to the `exercise_about` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exercise_about` DROP FOREIGN KEY `Order_Page_About_fkey`;

-- AlterTable
ALTER TABLE `exercise_about` ADD COLUMN `page_about_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `exercise_about` ADD CONSTRAINT `Order_Page_About_fkey` FOREIGN KEY (`page_about_id`) REFERENCES `page_about`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
