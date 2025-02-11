/*
  Warnings:

  - You are about to drop the column `emp_ID` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `payment_confirmation` on the `bookings` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `bookings` DROP FOREIGN KEY `Bookings_emp_ID_fkey`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `emp_ID`,
    DROP COLUMN `payment_confirmation`,
    ADD COLUMN `oder_ID` INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `oders` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `totalprice` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Bookings_oder_ID_fkey` ON `bookings`(`oder_ID`);

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_order_ID_fkey` FOREIGN KEY (`oder_ID`) REFERENCES `oders`(`order_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `oders` ADD CONSTRAINT `oders_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
