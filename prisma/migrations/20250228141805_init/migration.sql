-- CreateTable
CREATE TABLE `page_contact` (
    `page_contact_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(50) NULL,
    `subtitle` VARCHAR(255) NULL,
    `banner` VARCHAR(255) NULL,
    `title_contact` VARCHAR(255) NULL,
    `subtitle_contact` VARCHAR(255) NULL,
    `title_map` VARCHAR(255) NULL,
    `link_map` VARCHAR(255) NULL,

    PRIMARY KEY (`page_contact_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contact_channels` (
    `contact_channels_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `icon` VARCHAR(255) NULL,
    `name` VARCHAR(255) NULL,
    `data` VARCHAR(255) NULL,
    `page_contact_ID` INTEGER NOT NULL,

    INDEX `Contact_Channels_Contact_Channels_ID_fkey`(`contact_channels_ID`),
    PRIMARY KEY (`contact_channels_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `contact_channels` ADD CONSTRAINT `Order_Page_Contact_fkey` FOREIGN KEY (`page_contact_ID`) REFERENCES `page_contact`(`page_contact_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
