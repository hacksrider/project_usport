/*
  Warnings:

  - You are about to alter the column `img_content_path` on the `content` table. The data in that column could be lost. The data in that column will be cast from `VarChar(256)` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE `content` MODIFY `img_content_path` VARCHAR(255) NOT NULL;
