/*
  Warnings:

  - Added the required column `complements` to the `addresses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "complements" VARCHAR(255) NOT NULL;
