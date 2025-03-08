/*
  Warnings:

  - You are about to drop the `price_exercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `time_of_service` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `price_exercise` DROP FOREIGN KEY `Price_Exercise_time_ID_fkey`;

-- DropForeignKey
ALTER TABLE `time_of_service` DROP FOREIGN KEY `Time_of_Service_service_ID_fkey`;

-- DropTable
DROP TABLE `price_exercise`;

-- DropTable
DROP TABLE `time_of_service`;

-- CreateTable
CREATE TABLE `time_and_price` (
    `time_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `quantity_of_days` INTEGER NOT NULL,
    `unit` VARCHAR(10) NOT NULL,
    `price` INTEGER NOT NULL,

    INDEX `time_and_price_service_ID_fkey`(`service_ID`),
    PRIMARY KEY (`time_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `time_and_price` ADD CONSTRAINT `time_and_price_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
