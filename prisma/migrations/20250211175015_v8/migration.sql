/*
  Warnings:

  - Added the required column `period_ID` to the `pricefield` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pricefield` ADD COLUMN `period_ID` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `period` (
    `period_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `period_start` DATETIME(3) NOT NULL,
    `period_end` DATETIME(3) NOT NULL,

    PRIMARY KEY (`period_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `PriceField_period_ID_fkey` ON `pricefield`(`period_ID`);

-- AddForeignKey
ALTER TABLE `pricefield` ADD CONSTRAINT `PriceField_period_ID_fkey` FOREIGN KEY (`period_ID`) REFERENCES `period`(`period_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
