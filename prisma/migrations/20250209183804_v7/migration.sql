-- CreateTable
CREATE TABLE `accountBank` (
    `acc_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `path_image_acc` VARCHAR(255) NOT NULL,
    `path_image_Prom` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`acc_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
