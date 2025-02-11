/*
  Warnings:

  - You are about to drop the column `Price` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `amount_of_time` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `buying_date` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `desired_start_date` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `expire_date` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `service_ID` on the `buying_exercise` table. All the data in the column will be lost.
  - You are about to drop the column `units` on the `buying_exercise` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `buying_exercise` DROP FOREIGN KEY `Buying_Exercise_service_ID_fkey`;

-- AlterTable
ALTER TABLE `buying_exercise` DROP COLUMN `Price`,
    DROP COLUMN `amount_of_time`,
    DROP COLUMN `buying_date`,
    DROP COLUMN `desired_start_date`,
    DROP COLUMN `expire_date`,
    DROP COLUMN `service_ID`,
    DROP COLUMN `units`;

-- CreateTable
CREATE TABLE `order` (
    `order_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `buying_ID` INTEGER NOT NULL,
    `service_ID` INTEGER NOT NULL,
    `service_name` VARCHAR(191) NOT NULL,
    `buying_date` DATETIME(3) NOT NULL,
    `amount_of_time` VARCHAR(15) NOT NULL,
    `units` VARCHAR(10) NOT NULL,
    `desired_start_date` DATETIME(3) NOT NULL,
    `expire_date` DATETIME(3) NOT NULL,
    `Price` INTEGER NOT NULL,

    INDEX `Order_Buying_Exercise_fkey`(`buying_ID`),
    INDEX `Order_Service_ID_fkey`(`service_ID`),
    PRIMARY KEY (`order_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_buying_exerciseToservice_of_exercise` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_buying_exerciseToservice_of_exercise_AB_unique`(`A`, `B`),
    INDEX `_buying_exerciseToservice_of_exercise_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_Buying_Exercise_fkey` FOREIGN KEY (`buying_ID`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `Order_Service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_A_fkey` FOREIGN KEY (`A`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_buying_exerciseToservice_of_exercise` ADD CONSTRAINT `_buying_exerciseToservice_of_exercise_B_fkey` FOREIGN KEY (`B`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
