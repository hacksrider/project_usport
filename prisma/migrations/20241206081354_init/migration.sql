/*
  Warnings:

  - Added the required column `emp_Name` to the `Employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `emp_username` to the `Employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `employees` ADD COLUMN `emp_Name` VARCHAR(100) NOT NULL,
    ADD COLUMN `emp_username` VARCHAR(50) NOT NULL;
