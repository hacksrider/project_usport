-- AlterTable
ALTER TABLE `users` MODIFY `user_tel` VARCHAR(15) NOT NULL,
    ALTER COLUMN `user_email` DROP DEFAULT,
    ALTER COLUMN `user_lastname` DROP DEFAULT,
    MODIFY `user_password` VARCHAR(255) NOT NULL,
    MODIFY `sex` VARCHAR(20) NULL;
