/*
  Warnings:

  - Added the required column `sex` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `sex` VARCHAR(10) NOT NULL,
    ADD COLUMN `user_profile_picture` VARCHAR(255) NULL;
