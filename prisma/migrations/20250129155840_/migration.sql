/*
  Warnings:

  - You are about to alter the column `booking_status` on the `bookings` table. The data in that column could be lost. The data in that column will be cast from `TinyInt` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `bookings` MODIFY `booking_status` VARCHAR(255) NOT NULL;
