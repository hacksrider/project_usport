-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `Order_Buying_Exercise_fkey`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `Order_Buying_Exercise_fkey` FOREIGN KEY (`buying_ID`) REFERENCES `buying_exercise`(`buying_ID`) ON DELETE CASCADE ON UPDATE CASCADE;
