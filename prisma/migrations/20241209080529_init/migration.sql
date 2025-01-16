/*
  Warnings:

  - The primary key for the `bookings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `boking_ID` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `booking_ID` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `booking_status` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price_ID` to the `Bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_sex` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_emp_ID_fkey`;

-- AlterTable
ALTER TABLE `bookings` DROP PRIMARY KEY,
    DROP COLUMN `boking_ID`,
    DROP COLUMN `price`,
    ADD COLUMN `booking_ID` INTEGER NOT NULL AUTO_INCREMENT,
    ADD COLUMN `booking_status` VARCHAR(20) NOT NULL,
    ADD COLUMN `price_ID` INTEGER NOT NULL,
    ADD PRIMARY KEY (`booking_ID`);

-- AlterTable
ALTER TABLE `employees` ADD COLUMN `emp_sex` VARCHAR(10) NOT NULL;

-- CreateTable
CREATE TABLE `Fields` (
    `field_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(50) NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`field_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceField` (
    `price_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_ID` INTEGER NOT NULL,
    `period_ID` INTEGER NOT NULL,
    `slot_ID` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`price_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Period` (
    `period_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `period_start` DATETIME(3) NOT NULL,
    `period_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`period_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeSlot` (
    `slot_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `slot_start` DATETIME(3) NOT NULL,
    `slot_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`slot_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `user_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(100) NOT NULL,
    `emp_sex` VARCHAR(10) NOT NULL,
    `user_date_of_birth` DATETIME(3) NOT NULL,
    `user_tel` VARCHAR(10) NOT NULL,
    `user_username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `ID_card_photo` VARCHAR(255) NOT NULL,
    `accom_rent_contrac_photo` VARCHAR(255) NOT NULL,
    `status_of_VIP` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`user_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BuyingExercise` (
    `buying_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `buying_date` DATETIME(3) NOT NULL,
    `amount_of_time` INTEGER NOT NULL,
    `desired_start_date` DATETIME(3) NOT NULL,
    `expire_date` DATETIME(3) NOT NULL,
    `price_ID` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(12) NOT NULL,
    `buying_status` VARCHAR(20) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`buying_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PriceExercise` (
    `price_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `time_ID` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    PRIMARY KEY (`price_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServiceExercise` (
    `service_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_name` VARCHAR(100) NOT NULL,
    `capacity_of_room` INTEGER NOT NULL,
    `status` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`service_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeOfService` (
    `time_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(20) NOT NULL,

    PRIMARY KEY (`time_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `re_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NOT NULL,
    `text_review` VARCHAR(255) NOT NULL,
    `score` INTEGER NOT NULL,
    `start_or_end_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price_ID` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(12) NOT NULL,

    PRIMARY KEY (`re_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookingsToUsers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookingsToUsers_AB_unique`(`A`, `B`),
    INDEX `_BookingsToUsers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookingsToFields` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookingsToFields_AB_unique`(`A`, `B`),
    INDEX `_BookingsToFields_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_emp_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_price_fkey` FOREIGN KEY (`price_ID`) REFERENCES `PriceField`(`price_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceField` ADD CONSTRAINT `PriceField_field_fkey` FOREIGN KEY (`field_ID`) REFERENCES `Fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceField` ADD CONSTRAINT `PriceField_period_fkey` FOREIGN KEY (`period_ID`) REFERENCES `Period`(`period_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceField` ADD CONSTRAINT `PriceField_slot_fkey` FOREIGN KEY (`slot_ID`) REFERENCES `TimeSlot`(`slot_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_user_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_service_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_price_fkey` FOREIGN KEY (`price_ID`) REFERENCES `PriceExercise`(`price_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BuyingExercise` ADD CONSTRAINT `BuyingExercise_emp_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceExercise` ADD CONSTRAINT `PriceExercise_service_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PriceExercise` ADD CONSTRAINT `PriceExercise_time_fkey` FOREIGN KEY (`time_ID`) REFERENCES `TimeOfService`(`time_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_user_fkey` FOREIGN KEY (`user_ID`) REFERENCES `Users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_service_fkey` FOREIGN KEY (`service_ID`) REFERENCES `ServiceExercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_price_fkey` FOREIGN KEY (`price_ID`) REFERENCES `PriceExercise`(`price_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingsToUsers` ADD CONSTRAINT `_BookingsToUsers_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bookings`(`booking_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingsToUsers` ADD CONSTRAINT `_BookingsToUsers_B_fkey` FOREIGN KEY (`B`) REFERENCES `Users`(`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingsToFields` ADD CONSTRAINT `_BookingsToFields_A_fkey` FOREIGN KEY (`A`) REFERENCES `Bookings`(`booking_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookingsToFields` ADD CONSTRAINT `_BookingsToFields_B_fkey` FOREIGN KEY (`B`) REFERENCES `Fields`(`field_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
