/*
  Warnings:

  - You are about to drop the column `partnered` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `bots` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `bots` table. All the data in the column will be lost.
  - You are about to alter the column `Date` on the `reports` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `date` on the `servers` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `bots` DROP COLUMN `partnered`,
    DROP COLUMN `status`,
    DROP COLUMN `verified`;

-- AlterTable
ALTER TABLE `reports` MODIFY `Date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `servers` MODIFY `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
