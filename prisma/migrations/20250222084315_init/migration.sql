/*
  Warnings:

  - Added the required column `price_ID` to the `time_of_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `price_exercise` DROP FOREIGN KEY `Price_Exercise_time_ID_fkey`;

-- AlterTable
ALTER TABLE `time_of_service` ADD COLUMN `price_ID` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `time_of_service` ADD CONSTRAINT `Time_of_Service_price_ID_fkey` FOREIGN KEY (`price_ID`) REFERENCES `price_exercise`(`price_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
