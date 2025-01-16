-- DropForeignKey
ALTER TABLE `price_exercise` DROP FOREIGN KEY `Price_Exercise_service_ID_fkey`;

-- AddForeignKey
ALTER TABLE `Price_Exercise` ADD CONSTRAINT `Price_Exercise_service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `Service_of_Exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
