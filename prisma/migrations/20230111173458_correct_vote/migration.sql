/*
  Warnings:

  - You are about to drop the column `text` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Vote` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Vote` table. All the data in the column will be lost.
  - Added the required column `votedAgainst` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votedFor` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Vote` DROP COLUMN `text`,
    DROP COLUMN `title`,
    DROP COLUMN `updatedAt`,
    ADD COLUMN `votedAgainst` INTEGER NOT NULL,
    ADD COLUMN `votedFor` INTEGER NOT NULL;
