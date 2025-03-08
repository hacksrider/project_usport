-- CreateTable
CREATE TABLE `page_about` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `detail` VARCHAR(255) NOT NULL,
    `banner` VARCHAR(255) NOT NULL,
    `datail_usport1` VARCHAR(255) NOT NULL,
    `datail_usport2` VARCHAR(255) NOT NULL,
    `video` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exercise_about` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NOT NULL,
    `detail` VARCHAR(255) NOT NULL,

    INDEX `Order_Buying_Exercise_fkey`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `exercise_about` ADD CONSTRAINT `Order_Page_About_fkey` FOREIGN KEY (`id`) REFERENCES `page_about`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
