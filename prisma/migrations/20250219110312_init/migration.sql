/*
  Warnings:

  - The primary key for the `exercise_about` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `exercise_about` table. All the data in the column will be lost.
  - The primary key for the `page_about` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `page_about` table. All the data in the column will be lost.
  - Added the required column `exercise_about_id` to the `exercise_about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page_about_id` to the `page_about` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `exercise_about` DROP FOREIGN KEY `Order_Page_About_fkey`;

-- DropIndex
DROP INDEX `Order_Buying_Exercise_fkey` ON `exercise_about`;

-- AlterTable
ALTER TABLE `exercise_about` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `exercise_about_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`exercise_about_id`);

-- AlterTable
ALTER TABLE `page_about` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `page_about_id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`page_about_id`);

-- CreateIndex
CREATE INDEX `Order_Buying_Exercise_fkey` ON `exercise_about`(`exercise_about_id`);

-- AddForeignKey
ALTER TABLE `exercise_about` ADD CONSTRAINT `Order_Page_About_fkey` FOREIGN KEY (`page_about_id`) REFERENCES `page_about`(`page_about_id`) ON DELETE CASCADE ON UPDATE CASCADE;
