-- AlterTable
ALTER TABLE `users` MODIFY `ID_card_photo` VARCHAR(255) NULL,
    MODIFY `user_email` VARCHAR(100) NULL DEFAULT '',
    MODIFY `sex` VARCHAR(10) NULL;
