/*
  Warnings:

  - You are about to alter the column `booking_date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `desired_booking_date` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `end_Time` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.
  - You are about to alter the column `start_Time` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `booking_date` DATETIME(3) NOT NULL,
    MODIFY `desired_booking_date` DATETIME(3) NOT NULL,
    MODIFY `end_Time` DATETIME(3) NOT NULL,
    MODIFY `start_Time` DATETIME(3) NOT NULL;
