/*
  Warnings:

  - You are about to drop the column `price_ID` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `start_or_end_time` on the `bookings` table. All the data in the column will be lost.
  - You are about to alter the column `user_ID` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Int`.
  - You are about to alter the column `field_ID` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `Int`.
  - You are about to alter the column `booking_date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `DateTime(3)`.
  - You are about to alter the column `desired_booking_date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `DateTime(3)`.
  - You are about to alter the column `booking_status` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `TinyInt`.
  - You are about to drop the column `price_ID` on the `buyingexercise` table. All the data in the column will be lost.
  - You are about to alter the column `buying_status` on the `buyingexercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `TinyInt`.
  - You are about to drop the column `emp_Name` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `manager_id` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `employees` table. All the data in the column will be lost.
  - You are about to alter the column `emp_job` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `TinyInt`.
  - You are about to alter the column `emp_username` on the `employees` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `field_name` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(15)`.
  - You are about to alter the column `status` on the `fields` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `TinyInt`.
  - You are about to drop the column `price` on the `pricefield` table. All the data in the column will be lost.
  - You are about to drop the column `slot_ID` on the `pricefield` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `serviceexercise` table. All the data in the column will be lost.
  - You are about to alter the column `service_name` on the `serviceexercise` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to drop the column `time` on the `timeofservice` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `emp_sex` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to alter the column `user_name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `user_username` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(50)` to `VarChar(20)`.
  - You are about to alter the column `status_of_VIP` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `TinyInt`.
  - You are about to drop the `_bookingstofields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bookingstousers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `timeslot` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[user_email]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Price` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end_Time` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start_Time` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Price` to the `BuyingExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_lastname` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_name` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_password` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_for_2h` to the `PriceField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_per_1h` to the `PriceField` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Status` to the `ServiceExercise` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity_of_days` to the `TimeOfService` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_bookingstofields` DROP FOREIGN KEY `_BookingsToFields_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingstofields` DROP FOREIGN KEY `_BookingsToFields_B_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingstousers` DROP FOREIGN KEY `_BookingsToUsers_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bookingstousers` DROP FOREIGN KEY `_BookingsToUsers_B_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_emp_fkey`;

-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_price_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_emp_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_price_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_service_fkey`;

-- DropForeignKey
ALTER TABLE `buyingexercise` DROP FOREIGN KEY `BuyingExercise_user_fkey`;

-- DropForeignKey
ALTER TABLE `employees` DROP FOREIGN KEY `Employees_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `priceexercise` DROP FOREIGN KEY `PriceExercise_service_fkey`;

-- DropForeignKey
ALTER TABLE `priceexercise` DROP FOREIGN KEY `PriceExercise_time_fkey`;

-- DropForeignKey
ALTER TABLE `pricefield` DROP FOREIGN KEY `PriceField_field_fkey`;

-- DropForeignKey
ALTER TABLE `pricefield` DROP FOREIGN KEY `PriceField_period_fkey`;

-- DropForeignKey
ALTER TABLE `pricefield` DROP FOREIGN KEY `PriceField_slot_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_price_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_service_fkey`;

-- DropForeignKey
ALTER TABLE `review` DROP FOREIGN KEY `Review_user_fkey`;

-- DropIndex
DROP INDEX `Users_email_key` ON `users`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `price_ID`,
    DROP COLUMN `start_or_end_time`,
    ADD COLUMN `Price` INTEGER NOT NULL,
    ADD COLUMN `end_Time` DATETIME(3) NOT NULL,
    ADD COLUMN `start_Time` DATETIME(3) NOT NULL,
    MODIFY `user_ID` INTEGER NOT NULL,
    MODIFY `field_ID` INTEGER NOT NULL,
    MODIFY `booking_date` DATETIME(3) NOT NULL,
    MODIFY `desired_booking_date` DATETIME(3) NOT NULL,
    MODIFY `payment_confirmation` VARCHAR(255) NOT NULL,
    MODIFY `booking_status` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `buyingexercise` DROP COLUMN `price_ID`,
    ADD COLUMN `Price` INTEGER NOT NULL,
    MODIFY `amount_of_time` VARCHAR(15) NOT NULL,
    MODIFY `payment_confirmation` VARCHAR(255) NOT NULL,
    MODIFY `buying_status` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `employees` DROP COLUMN `emp_Name`,
    DROP COLUMN `manager_id`,
    DROP COLUMN `password`,
    ADD COLUMN `emp_lastname` VARCHAR(50) NOT NULL,
    ADD COLUMN `emp_name` VARCHAR(50) NOT NULL,
    ADD COLUMN `emp_password` VARCHAR(10) NOT NULL,
    MODIFY `emp_job` BOOLEAN NOT NULL,
    MODIFY `emp_username` VARCHAR(20) NOT NULL,
    MODIFY `emp_sex` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `fields` MODIFY `field_name` VARCHAR(15) NOT NULL,
    MODIFY `status` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `pricefield` DROP COLUMN `price`,
    DROP COLUMN `slot_ID`,
    ADD COLUMN `price_for_2h` INTEGER NOT NULL,
    ADD COLUMN `price_per_1h` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `serviceexercise` DROP COLUMN `status`,
    ADD COLUMN `Status` BOOLEAN NOT NULL,
    MODIFY `service_name` VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE `timeofservice` DROP COLUMN `time`,
    ADD COLUMN `quantity_of_days` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `email`,
    DROP COLUMN `emp_sex`,
    DROP COLUMN `password`,
    ADD COLUMN `user_email` VARCHAR(10) NOT NULL DEFAULT '',
    ADD COLUMN `user_lastname` VARCHAR(50) NOT NULL DEFAULT '',
    ADD COLUMN `user_password` VARCHAR(10) NOT NULL DEFAULT '',
    MODIFY `user_name` VARCHAR(50) NOT NULL,
    MODIFY `user_username` VARCHAR(20) NOT NULL,
    MODIFY `status_of_VIP` BOOLEAN NOT NULL;

-- DropTable
DROP TABLE `_bookingstofields`;

-- DropTable
DROP TABLE `_bookingstousers`;

-- DropTable
DROP TABLE `review`;

-- DropTable
DROP TABLE `timeslot`;

-- CreateTable
CREATE TABLE `Reviews` (
    `re_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`re_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Content` (
    `content_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `img_content_path` VARCHAR(256) NOT NULL,

    PRIMARY KEY (`content_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Users_user_email_key` ON `Users`(`user_email`);

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `Fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceField` ADD CONSTRAINT `PriceField_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `Fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceField` ADD CONSTRAINT `PriceField_period_ID_fkey` FOREIGN KEY (`period_ID`) REFERENCES `Period`(`period_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceExercise` ADD CONSTRAINT `PriceExercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceExercise` ADD CONSTRAINT `PriceExercise_time_ID_fkey` FOREIGN KEY (`time_ID`) REFERENCES `TimeOfService`(`time_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reviews` ADD CONSTRAINT `Reviews_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
