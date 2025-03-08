-- DropForeignKey
ALTER TABLE `orders_exercise` DROP FOREIGN KEY `Order_Service_ID_fkey`;

-- AddForeignKey
ALTER TABLE `orders_exercise` ADD CONSTRAINT `Order_Service_ID_fkey` FOREIGN KEY (`service_ID`) REFERENCES `service_of_exercise`(`service_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
