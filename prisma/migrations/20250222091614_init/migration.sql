/*
  Warnings:

  - You are about to drop the column `service_ID` on the `price_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `price_ID` on the `time_of_service` table. All the data in the column will be lost.
  - Added the required column `service_ID` to the `time_of_service` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `price_exercise` DROP FOREIGN KEY `Price_Exercise_service_ID_fkey`;

-- DropForeignKey
ALTER TABLE `time_of_service` DROP FOREIGN KEY `Time_of_Service_price_ID_fkey`;

-- AlterTable
ALTER TABLE `price_exercise` DROP COLUMN `service_ID`;

-- AlterTable
ALTER TABLE `time_of_service` DROP COLUMN `price_ID`,
    ADD COLUMN `service_ID` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Time_of_Service_service_ID_fkey` ON `time_of_service`(`service_ID`);

-- AddForeignKey
ALTER TABLE `time_of_service` ADD CONSTRAINT `Time_of_Service_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_exercise` ADD CONSTRAINT `Price_Exercise_time_ID_fkey` FOREIGN KEY (`time_ID`) REFERENCES `time_of_service`(`time_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
