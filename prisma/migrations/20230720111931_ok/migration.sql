/*
  Warnings:

  - Made the column `bio` on table `Author` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `Author` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `address` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "Genre" ADD VALUE 'Literature';

-- AlterTable
ALTER TABLE "Author" ALTER COLUMN "bio" SET NOT NULL,
ALTER COLUMN "dob" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "address" SET NOT NULL;
