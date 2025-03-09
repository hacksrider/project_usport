/*
  Warnings:

  - Added the required column `field_ID` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `reviews` ADD COLUMN `field_ID` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Reviews_field_ID_fkey` ON `reviews`(`field_ID`);

-- AddForeignKey
ALTER TABLE `reviews` ADD CONSTRAINT `Reviews_field_ID_fkey` FOREIGN KEY (`field_ID`) REFERENCES `fields`(`field_ID`) ON DELETE RESTRICT ON UPDATE CASCADE;
