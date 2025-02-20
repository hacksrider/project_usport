-- AlterTable
ALTER TABLE `users` ADD COLUMN `type_of_user` VARCHAR(255) NULL,
    MODIFY `user_date_of_birth` DATETIME(3) NULL,
    MODIFY `user_username` VARCHAR(20) NULL,
    MODIFY `status_of_VIP` BOOLEAN NULL DEFAULT false,
    MODIFY `status_of_Member` BOOLEAN NULL DEFAULT false,
    MODIFY `user_password` VARCHAR(255) NULL;
