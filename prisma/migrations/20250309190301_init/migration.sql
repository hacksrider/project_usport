-- CreateTable
CREATE TABLE `ResetToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` VARCHAR(191) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ResetToken_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

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
CREATE TABLE `orders_exercise` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `buying_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `service_name` VARCHAR(191) NOT NULL,
    `amount_of_time` VARCHAR(15) NOT NULL,
    `units` VARCHAR(10) NOT NULL,
    `desired_start_date` DATETIME(3) NOT NULL,
    `status_order` VARCHAR(191) NOT NULL DEFAULT 'รอใช้บริการ',
    `expire_date` DATETIME(3) NOT NULL,
    `Price` INTEGER NOT NULL,

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
    `emp_email` VARCHAR(100) NULL,
    `emp_password` VARCHAR(10) NOT NULL,

    UNIQUE INDEX `Employees_emp_username_key`(`emp_username`),
    UNIQUE INDEX `Employees_emp_email_key`(`emp_email`),
    PRIMARY KEY (`emp_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fields` (
    `field_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_name` VARCHAR(15) NOT NULL,
    `status` BOOLEAN NOT NULL,

    PRIMARY KEY (`field_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reviews_field` (
    `review_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,

    PRIMARY KEY (`review_ID`)
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
    `deleted` TINYINT NOT NULL DEFAULT 1,

    PRIMARY KEY (`service_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_and_price` (
    `time_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `service_ID` INTEGER NOT NULL,
    `quantity_of_days` INTEGER NULL,
    `unit` VARCHAR(10) NULL,
    `price` INTEGER NULL,

    INDEX `time_and_price_service_ID_fkey`(`service_ID`),
    PRIMARY KEY (`time_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `user_name` VARCHAR(50) NOT NULL,
    `user_lastname` VARCHAR(50) NOT NULL,
    `user_tel` VARCHAR(15) NOT NULL,
    `user_date_of_birth` DATETIME(3) NULL,
    `ID_card_photo` VARCHAR(255) NULL,
    `accom_rent_contrac_photo` VARCHAR(255) NULL,
    `status_of_VIP` BOOLEAN NULL DEFAULT false,
    `status_of_Member` BOOLEAN NULL DEFAULT false,
    `user_email` VARCHAR(100) NULL,
    `user_username` VARCHAR(20) NULL,
    `user_password` VARCHAR(255) NULL,
    `sex` VARCHAR(20) NULL,
    `user_profile_picture` VARCHAR(255) NULL,
    `type_of_user` VARCHAR(255) NULL,

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
CREATE TABLE `page_home` (
    `page_home_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `subtitle` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,

    PRIMARY KEY (`page_home_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_home_exercise` (
    `page_home_service_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name_exercise` VARCHAR(50) NULL,
    `description` VARCHAR(255) NULL,
    `banner_exercise` VARCHAR(255) NULL,
    `page_home_id` INTEGER NOT NULL,

    PRIMARY KEY (`page_home_service_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_home_promotion` (
    `page_home_promotion_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title_promotion` VARCHAR(50) NULL,
    `detail_promotion` VARCHAR(255) NULL,
    `banner_promotion` VARCHAR(255) NULL,
    `page_home_id` INTEGER NOT NULL,

    PRIMARY KEY (`page_home_promotion_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_home_gallery` (
    `page_home_gallery_id` INTEGER NOT NULL AUTO_INCREMENT,
    `picture_gallery` VARCHAR(255) NULL,
    `page_home_id` INTEGER NOT NULL,

    PRIMARY KEY (`page_home_gallery_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_about` (
    `page_about_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `detail` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,
    `detail_usport1` VARCHAR(255) NULL,
    `detail_usport2` VARCHAR(255) NULL,
    `video` VARCHAR(255) NULL,

    PRIMARY KEY (`page_about_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_about` (
    `exercise_about_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `detail` VARCHAR(255) NULL,
    `page_about_id` INTEGER NOT NULL,

    INDEX `Exercise_About_Exercise_About_ID_fkey`(`exercise_about_id`),
    PRIMARY KEY (`exercise_about_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_contact` (
    `page_contact_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `subtitle` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,
    `title_contact` VARCHAR(50) NULL,
    `subtitle_contact` VARCHAR(255) NULL,
    `title_map` VARCHAR(50) NULL,
    `link_map` VARCHAR(2000) NULL,

    PRIMARY KEY (`page_contact_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_channels` (
    `contact_channels_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NULL,
    `data` VARCHAR(255) NULL,
    `page_contact_ID` INTEGER NOT NULL,

    INDEX `Contact_Channels_Contact_Channels_ID_fkey`(`contact_channels_ID`),
    PRIMARY KEY (`contact_channels_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_exercise` (
    `page_exercise_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `subtitle` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,

    PRIMARY KEY (`page_exercise_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_data` (
    `exercise_data_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(25) NULL,
    `banner` VARCHAR(255) NULL,
    `price` VARCHAR(25) NULL,
    `detail` VARCHAR(255) NULL,
    `table_price` VARCHAR(255) NULL,
    `picture` VARCHAR(255) NULL,
    `page_exercise_ID` INTEGER NOT NULL,

    INDEX `Exercise_Data_Exercise_Data_ID_fkey`(`exercise_data_ID`),
    PRIMARY KEY (`exercise_data_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_buying_exerciseToservice_of_exercise` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_buying_exerciseToservice_of_exercise_AB_unique`(`A`, `B`),
    INDEX `_buying_exerciseToservice_of_exercise_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResetToken` ADD CONSTRAINT `ResetToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE `orders_exercise` ADD CONSTRAINT `Order_Buying_Exercise_fkey` FOREIGN KEY (`buying_ID`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_exercise` ADD CONSTRAINT `Order_Service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews_field` ADD CONSTRAINT `reviews_field_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews_field` ADD CONSTRAINT `reviews_field_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricefield` ADD CONSTRAINT `PriceField_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `pricefield` ADD CONSTRAINT `PriceField_period_ID_fkey` FOREIGN KEY (`period_ID`) REFERENCES `period`(`period_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `Reviews_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `Reviews_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_and_price` ADD CONSTRAINT `time_and_price_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_home_exercise` ADD CONSTRAINT `page_home_exercise_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_home_promotion` ADD CONSTRAINT `page_home_promotion_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_home_gallery` ADD CONSTRAINT `page_home_gallery_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercise_about` ADD CONSTRAINT `Order_Page_About_fkey` FOREIGN KEY (`page_about_id`) REFERENCES `page_about`(`page_about_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_channels` ADD CONSTRAINT `Order_Page_Contact_fkey` FOREIGN KEY (`page_contact_ID`) REFERENCES `page_contact`(`page_contact_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercise_data` ADD CONSTRAINT `Order_Page_Exercise_fkey` FOREIGN KEY (`page_exercise_ID`) REFERENCES `page_exercise`(`page_exercise_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_A_fkey` FOREIGN KEY (`A`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_B_fkey` FOREIGN KEY (`B`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
