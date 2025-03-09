/*
  Warnings:

  - You are about to drop the column `field_ID` on the `reviews` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `reviews` DROP FOREIGN KEY `Reviews_field_ID_fkey`;

-- AlterTable
ALTER TABLE `reviews` DROP COLUMN `field_ID`;

-- CreateTable
CREATE TABLE `reviews_field` (
    `review_ID` INTEGER NOT NULL AUTO_INCREMENT,
    `field_ID` INTEGER NOT NULL,
    `user_ID` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `comment` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`review_ID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `reviews_field` ADD CONSTRAINT `reviews_field_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reviews_field` ADD CONSTRAINT `reviews_field_user_ID_fkey` FOREIGN KEY (`user_ID`) REFERENCES `users`(`user_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
