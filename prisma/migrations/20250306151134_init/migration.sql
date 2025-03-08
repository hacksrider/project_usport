/*
  Warnings:

  - A unique constraint covering the columns `[emp_email]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `employees` ADD COLUMN `emp_email` VARCHAR(100) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Employees_emp_email_key` ON `employees`(`emp_email`);
