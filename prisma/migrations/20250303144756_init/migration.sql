-- DropForeignKey
ALTER TABLE `contact_channels` DROP FOREIGN KEY `Order_Page_Contact_fkey`;

-- DropForeignKey
ALTER TABLE `exercise_about` DROP FOREIGN KEY `Order_Page_About_fkey`;

-- AlterTable
ALTER TABLE `page_contact` MODIFY `link_map` VARCHAR(2000) NULL;

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

-- AddForeignKey
ALTER TABLE `exercise_about` ADD CONSTRAINT `Order_Page_About_fkey` FOREIGN KEY (`page_about_id`) REFERENCES `page_about`(`page_about_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contact_channels` ADD CONSTRAINT `Order_Page_Contact_fkey` FOREIGN KEY (`page_contact_ID`) REFERENCES `page_contact`(`page_contact_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exercise_data` ADD CONSTRAINT `Order_Page_Exercise_fkey` FOREIGN KEY (`page_exercise_ID`) REFERENCES `page_exercise`(`page_exercise_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
