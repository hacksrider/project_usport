-- DropForeignKey
ALTER TABLE `buying_exercise` DROP FOREIGN KEY `Buying_Exercise_emp_ID_fkey`;

-- AlterTable
ALTER TABLE `buying_exercise` MODIFY `emp_ID` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `buying_exercise` ADD CONSTRAINT `Buying_Exercise_emp_ID_fkey` FOREIGN KEY (`emp_ID`) REFERENCES `employees`(`emp_ID`) ON DELETE SET NULL ON UPDATE CASCADE;
