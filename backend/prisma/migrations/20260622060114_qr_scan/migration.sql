/*
  Warnings:

  - You are about to drop the column `destination` on the `qr` table. All the data in the column will be lost.
  - You are about to drop the column `updatedById` on the `qr` table. All the data in the column will be lost.
  - You are about to drop the column `browser` on the `qrscan` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `qrscan` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `qrscan` table. All the data in the column will be lost.
  - Added the required column `destinationUrl` to the `QR` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `qr` DROP FOREIGN KEY `QR_updatedById_fkey`;

-- DropForeignKey
ALTER TABLE `qr` DROP FOREIGN KEY `QR_workspaceId_fkey`;

-- DropForeignKey
ALTER TABLE `qrscan` DROP FOREIGN KEY `QRScan_qrId_fkey`;

-- DropIndex
DROP INDEX `QR_updatedById_fkey` ON `qr`;

-- AlterTable
ALTER TABLE `qr` DROP COLUMN `destination`,
    DROP COLUMN `updatedById`,
    ADD COLUMN `destinationUrl` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NULL,
    MODIFY `type` ENUM('URL', 'TEXT', 'EMAIL', 'PHONE', 'SMS', 'WIFI', 'FILE', 'VCARD') NOT NULL DEFAULT 'URL';

-- AlterTable
ALTER TABLE `qrscan` DROP COLUMN `browser`,
    DROP COLUMN `device`,
    DROP COLUMN `os`,
    ADD COLUMN `userAgent` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `QR_token_idx` ON `QR`(`token`);

-- CreateIndex
CREATE INDEX `QR_status_idx` ON `QR`(`status`);

-- CreateIndex
CREATE INDEX `QRScan_scannedAt_idx` ON `QRScan`(`scannedAt`);

-- AddForeignKey
ALTER TABLE `QR` ADD CONSTRAINT `QR_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QR` ADD CONSTRAINT `QR_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `QRScan` ADD CONSTRAINT `QRScan_qrId_fkey` FOREIGN KEY (`qrId`) REFERENCES `QR`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `qr` RENAME INDEX `QR_workspaceId_fkey` TO `QR_workspaceId_idx`;

-- RenameIndex
ALTER TABLE `qrscan` RENAME INDEX `QRScan_qrId_fkey` TO `QRScan_qrId_idx`;
