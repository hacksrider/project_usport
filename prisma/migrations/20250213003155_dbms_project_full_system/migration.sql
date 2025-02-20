-- CreateTable
CREATE TABLE `bookings` (
    `booking_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `field_ID` INTEGER NOT NULL,
    `booking_date` DATETIME(3) NOT NULL,
    `desired_booking_date` DATETIME(3) NOT NULL,
    `Price` INTEGER NOT NULL,
    `end_Time` DATETIME(3) NOT NULL,
    `start_Time` DATETIME(3) NOT NULL,
    `booking_status` VARCHAR(255) NOT NULL,
    `order_ID` INTEGER NOT NULL DEFAULT 0,

    INDEX `Bookings_field_ID_fkey`(`field_ID`),
    INDEX `Bookings_user_ID_fkey`(`user_ID`),
    INDEX `Bookings_oder_ID_fkey`(`order_ID`),
    PRIMARY KEY (`booking_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `order_Bookings` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `totalprice` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `emp_ID` INTEGER NOT NULL,

    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `buying_exercise` (
    `buying_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `payment_confirmation` VARCHAR(255) NOT NULL,
    `buying_date` DATETIME(3) NOT NULL,
    `buying_status` BOOLEAN NOT NULL,
    `emp_ID` INTEGER NULL,

    INDEX `Buying_Exercise_emp_ID_fkey`(`emp_ID`),
    INDEX `Buying_Exercise_user_ID_fkey`(`user_ID`),
    PRIMARY KEY (`buying_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `orders` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `buying_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `service_name` VARCHAR(191) NOT NULL,
    `amount_of_time` VARCHAR(15) NOT NULL,
    `units` VARCHAR(10) NOT NULL,
    `desired_start_date` DATETIME(3) NOT NULL,
    `status_order` INTEGER NOT NULL DEFAULT 0,
    `expire_date` DATETIME(3) NOT NULL,
    `Price` INTEGER NOT NULL,

    INDEX `Order_Buying_Exercise_fkey`(`buying_ID`),
    INDEX `Order_Service_ID_fkey`(`service_ID`),
    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `content` (
    `content_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `img_content_path` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`content_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `employees` (
    `emp_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `emp_name` VARCHAR(50) NOT NULL,
    `emp_lastname` VARCHAR(50) NOT NULL,
    `emp_sex` VARCHAR(50) NULL,
    `emp_tel` VARCHAR(10) NULL,
    `emp_job` BOOLEAN NOT NULL,
    `emp_username` VARCHAR(20) NOT NULL,
    `emp_password` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Employees_emp_username_key`(`emp_username`),
    PRIMARY KEY (`emp_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `price_exercise` (
    `price_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `time_ID` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,

    INDEX `Price_Exercise_service_ID_fkey`(`service_ID`),
    INDEX `Price_Exercise_time_ID_fkey`(`time_ID`),
    PRIMARY KEY (`price_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fields` (
    `field_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(15) NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`field_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `period` (
    `period_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `period_start` DATETIME(3) NOT NULL,
    `period_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`period_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pricefield` (
    `price_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_ID` INTEGER NOT NULL,
    `period_ID` INTEGER NOT NULL,
    `price_for_2h` INTEGER NOT NULL,
    `price_per_1h` INTEGER NOT NULL,

    INDEX `PriceField_field_ID_fkey`(`field_ID`),
    INDEX `PriceField_period_ID_fkey`(`period_ID`),
    PRIMARY KEY (`price_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews` (
    `re_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `Text_review` TEXT NOT NULL,

    INDEX `Reviews_service_ID_fkey`(`service_ID`),
    INDEX `Reviews_user_ID_fkey`(`user_ID`),
    PRIMARY KEY (`re_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `service_of_exercise` (
    `service_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_name` VARCHAR(20) NOT NULL,
    `capacity_of_room` INTEGER NOT NULL,
    `Status` BOOLEAN NOT NULL,

    PRIMARY KEY (`service_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_of_service` (
    `time_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `quantity_of_days` INTEGER NOT NULL,
    `unit` VARCHAR(10) NOT NULL,

    PRIMARY KEY (`time_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(50) NOT NULL,
    `user_date_of_birth` DATETIME(3) NOT NULL,
    `user_tel` VARCHAR(15) NOT NULL,
    `user_username` VARCHAR(20) NOT NULL,
    `ID_card_photo` VARCHAR(255) NULL,
    `accom_rent_contrac_photo` VARCHAR(255) NULL,
    `status_of_VIP` BOOLEAN NOT NULL DEFAULT false,
    `status_of_Member` BOOLEAN NOT NULL DEFAULT false,
    `user_email` VARCHAR(100) NULL,
    `user_lastname` VARCHAR(50) NOT NULL,
    `user_password` VARCHAR(255) NOT NULL,
    `sex` VARCHAR(20) NULL,
    `user_profile_picture` VARCHAR(255) NULL,

    UNIQUE INDEX `Users_user_username_key`(`user_username`),
    UNIQUE INDEX `Users_user_email_key`(`user_email`),
    PRIMARY KEY (`user_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `accountBank` (
    `acc_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `path_image_acc` VARCHAR(255) NOT NULL,
    `path_image_Prom` VARCHAR(255) NULL,

    PRIMARY KEY (`acc_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_buying_exerciseToservice_of_exercise` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_buying_exerciseToservice_of_exercise_AB_unique`(`A`, `B`),
    INDEX `_buying_exerciseToservice_of_exercise_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookings` ADD CONSTRAINT `Bookings_order_ID_fkey` FOREIGN KEY (`order_ID`) REFERENCES `order_Bookings`(`order_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_Bookings` ADD CONSTRAINT `order_Bookings_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buying_exercise` ADD CONSTRAINT `Buying_Exercise_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `buying_exercise` ADD CONSTRAINT `Buying_Exercise_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `Order_Buying_Exercise_fkey` FOREIGN KEY (`buying_ID`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `Order_Service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_exercise` ADD CONSTRAINT `Price_Exercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `price_exercise` ADD CONSTRAINT `Price_Exercise_time_ID_fkey` FOREIGN KEY (`time_ID`) REFERENCES `time_of_service`(`time_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricefield` ADD CONSTRAINT `PriceField_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricefield` ADD CONSTRAINT `PriceField_period_ID_fkey` FOREIGN KEY (`period_ID`) REFERENCES `period`(`period_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `Reviews_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `Reviews_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_A_fkey` FOREIGN KEY (`A`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_B_fkey` FOREIGN KEY (`B`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
