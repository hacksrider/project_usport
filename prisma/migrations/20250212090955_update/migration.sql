/*
  Warnings:

  - You are about to drop the `orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Order_Buying_Exercise_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Order_Service_ID_fkey`;

-- DropTable
DROP TABLE `orders`;

-- CreateTable
CREATE TABLE `orders_exercise` (
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

-- AddForeignKey
ALTER TABLE `orders_exercise` ADD CONSTRAINT `Order_Buying_Exercise_fkey` FOREIGN KEY (`buying_ID`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `orders_exercise` ADD CONSTRAINT `Order_Service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
