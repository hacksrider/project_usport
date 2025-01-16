/*
  Warnings:

  - You are about to drop the column `review` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `buyingexercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `priceexercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `serviceexercise` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timeofservice` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `Text_review` to the `Reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_emp_ID_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_service_ID_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_user_ID_fkey`;

-- DropForeignKey
ALTER TABLE `priceexercise` DROP FOREIGN KEY `PriceExercise_service_ID_fkey`;

-- DropForeignKey
ALTER TABLE `priceexercise` DROP FOREIGN KEY `PriceExercise_time_ID_fkey`;

-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `Reviews_service_ID_fkey`;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `review`,
    ADD COLUMN `Text_review` TEXT NOT NULL;

-- DropTable
DROP TABLE `buyingexercise`;

-- DropTable
DROP TABLE `priceexercise`;

-- DropTable
DROP TABLE `serviceexercise`;

-- DropTable
DROP TABLE `timeofservice`;

-- CreateTable
CREATE TABLE `Buying_Exercise` (
    `buying_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `buying_date` DATETIME(3) NOT NULL,
    `amount_of_time` VARCHAR(15) NOT NULL,
    `desired_start_date` DATETIME(3) NOT NULL,
    `expire_date` DATETIME(3) NOT NULL,
    `Price` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `buying_status` BOOLEAN NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`buying_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Price_Exercise` (
    `price_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `time_ID` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`price_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Time_Of_Service` (
    `time_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity_of_days` INTEGER NOT NULL,

    PRIMARY KEY (`time_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service_of_Exercise` (
    `service_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_name` VARCHAR(20) NOT NULL,
    `capacity_of_room` INTEGER NOT NULL,
    `Status` BOOLEAN NOT NULL,

    PRIMARY KEY (`service_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Buying_Exercise` ADD CONSTRAINT `Buying_Exercise_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Buying_Exercise` ADD CONSTRAINT `Buying_Exercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `Service_of_Exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Buying_Exercise` ADD CONSTRAINT `Buying_Exercise_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Price_Exercise` ADD CONSTRAINT `Price_Exercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `Service_of_Exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Price_Exercise` ADD CONSTRAINT `Price_Exercise_time_ID_fkey` FOREIGN KEY (`time_ID`) REFERENCES `Time_Of_Service`(`time_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `Service_of_Exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
