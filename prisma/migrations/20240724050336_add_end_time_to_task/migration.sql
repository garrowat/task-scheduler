/*
  Warnings:

  - Added the required column `endTime` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL;
