/*
  Warnings:

  - You are about to drop the column `emp_Name` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `emp_username` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `employees` DROP COLUMN `emp_Name`,
    DROP COLUMN `emp_username`;
