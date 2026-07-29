/*
  Warnings:

  - You are about to drop the column `status` on the `qr` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `QR_status_idx` ON `qr`;

-- AlterTable
ALTER TABLE `qr` DROP COLUMN `status`,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
