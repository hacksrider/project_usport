/*
  Warnings:

  - You are about to drop the column `datail_usport1` on the `page_about` table. All the data in the column will be lost.
  - You are about to drop the column `datail_usport2` on the `page_about` table. All the data in the column will be lost.
  - Added the required column `detail_usport1` to the `page_about` table without a default value. This is not possible if the table is not empty.
  - Added the required column `detail_usport2` to the `page_about` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `page_about` DROP COLUMN `datail_usport1`,
    DROP COLUMN `datail_usport2`,
    ADD COLUMN `detail_usport1` VARCHAR(255) NOT NULL,
    ADD COLUMN `detail_usport2` VARCHAR(255) NOT NULL;
