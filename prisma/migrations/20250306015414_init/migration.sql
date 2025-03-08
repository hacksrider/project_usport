-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
    ADD COLUMN `isEmailVerified` BOOLEAN NOT NULL DEFAULT false;
