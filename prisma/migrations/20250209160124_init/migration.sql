/*
  Warnings:

  - You are about to drop the column `status_of_Order` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `buying_exercise` ADD COLUMN `status_of_Order` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `status_of_Order`;
