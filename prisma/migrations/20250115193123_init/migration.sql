/*
  Warnings:

  - You are about to drop the column `unit` on the `price_exercise` table. All the data in the column will be lost.
  - Added the required column `unit` to the `Time_Of_Service` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `price_exercise` DROP COLUMN `unit`;

-- AlterTable
ALTER TABLE `time_of_service` ADD COLUMN `unit` VARCHAR(10) NOT NULL;
