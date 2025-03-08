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

-- AddForeignKey
ALTER TABLE `page_home_exercise` ADD CONSTRAINT `page_home_exercise_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_home_promotion` ADD CONSTRAINT `page_home_promotion_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_home_gallery` ADD CONSTRAINT `page_home_gallery_page_home_id_fkey` FOREIGN KEY (`page_home_id`) REFERENCES `page_home`(`page_home_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
