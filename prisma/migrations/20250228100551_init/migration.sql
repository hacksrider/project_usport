-- AlterTable
ALTER TABLE `exercise_about` MODIFY `title` VARCHAR(50) NULL,
    MODIFY `detail` VARCHAR(255) NULL;

-- AlterTable
ALTER TABLE `page_about` MODIFY `title` VARCHAR(50) NULL,
    MODIFY `detail` VARCHAR(255) NULL,
    MODIFY `banner` VARCHAR(255) NULL,
    MODIFY `video` VARCHAR(255) NULL,
    MODIFY `detail_usport1` VARCHAR(255) NULL,
    MODIFY `detail_usport2` VARCHAR(255) NULL;

-- RedefineIndex
CREATE INDEX `Exercise_About_Exercise_About_ID_fkey` ON `exercise_about`(`exercise_about_id`);
DROP INDEX `Order_Buying_Exercise_fkey` ON `exercise_about`;
