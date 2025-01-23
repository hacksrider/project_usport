/*
  Warnings:

  - A unique constraint covering the columns `[emp_username]` on the table `Employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Employees_emp_username_key` ON `Employees`(`emp_username`);
