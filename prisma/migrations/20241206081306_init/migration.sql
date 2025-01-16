-- CreateTable
CREATE TABLE `Employees` (
    `emp_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_Name` VARCHAR(100) NOT NULL,
    `emp_username` VARCHAR(50) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `emp_tel` VARCHAR(10) NOT NULL,
    `emp_job` VARCHAR(50) NOT NULL,
    `manager_id` INTEGER NULL,

    PRIMARY KEY (`emp_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Bookings` (
    `boking_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` VARCHAR(100) NOT NULL,
    `field_ID` VARCHAR(50) NOT NULL,
    `booking_date` VARCHAR(20) NOT NULL,
    `desired_booking_date` VARCHAR(10) NOT NULL,
    `start_or_end_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `price` INTEGER NOT NULL DEFAULT 0,
    `payment_confirmation` VARCHAR(12) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`boking_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Employees` ADD CONSTRAINT `Employees_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `Employees`(`emp_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Bookings` ADD CONSTRAINT `Bookings_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `Employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
