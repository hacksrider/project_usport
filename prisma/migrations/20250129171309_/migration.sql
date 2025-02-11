/*
  Warnings:

  - You are about to alter the column `booking_status` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `booking_status` VARCHAR(100) NOT NULL;
