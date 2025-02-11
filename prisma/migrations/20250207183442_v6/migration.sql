/*
  Warnings:

  - You are about to drop the column `oder_ID` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the `oders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_order_ID_fkey`;

-- DropForeignKey
ALTER TABLE `oders` DROP FOREIGN KEY `oders_emp_ID_fkey`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `oder_ID`,
    ADD COLUMN `order_ID` INTEGER NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE `oders`;

-- CreateTable
CREATE TABLE `orders` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `totalprice` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Bookings_oder_ID_fkey` ON `bookings`(`order_ID`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_order_ID_fkey` FOREIGN KEY (`order_ID`) REFERENCES `orders`(`order_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
