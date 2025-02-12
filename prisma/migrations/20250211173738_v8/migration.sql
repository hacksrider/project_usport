/*
  Warnings:

  - You are about to drop the column `period_ID` on the `pricefield` table. All the data in the column will be lost.
  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `period` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_order_ID_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_emp_ID_fkey`;

-- DropForeignKey
ALTER TABLE `pricefield` DROP FOREIGN KEY `PriceField_period_ID_fkey`;

-- AlterTable
ALTER TABLE `pricefield` DROP COLUMN `period_ID`;

-- DropTable
DROP TABLE `orders`;

-- DropTable
DROP TABLE `period`;

-- CreateTable
CREATE TABLE `order_Bookings` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `totalprice` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_order_ID_fkey` FOREIGN KEY (`order_ID`) REFERENCES `order_Bookings`(`order_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_Bookings` ADD CONSTRAINT `order_Bookings_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
