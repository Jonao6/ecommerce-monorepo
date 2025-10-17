/*
  Warnings:

  - Added the required column `neighbor` to the `addresses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `streetNumber` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "neighbor" VARCHAR(255) NOT NULL,
ADD COLUMN     "streetNumber" VARCHAR(255) NOT NULL;
