/*
  Warnings:

  - You are about to drop the column `icon` on the `contact_channels` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `contact_channels` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(25)`.
  - You are about to alter the column `title_contact` on the `page_contact` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.
  - You are about to alter the column `title_map` on the `page_contact` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE `contact_channels` DROP COLUMN `icon`,
    MODIFY `name` VARCHAR(25) NULL;

-- AlterTable
ALTER TABLE `page_contact` MODIFY `title_contact` VARCHAR(50) NULL,
    MODIFY `title_map` VARCHAR(50) NULL;
