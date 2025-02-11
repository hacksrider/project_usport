-- AlterTable
ALTER TABLE `bookings` MODIFY `booking_date` VARCHAR(191) NOT NULL,
    MODIFY `desired_booking_date` VARCHAR(191) NOT NULL,
    MODIFY `end_Time` VARCHAR(191) NOT NULL,
    MODIFY `start_Time` VARCHAR(191) NOT NULL;
