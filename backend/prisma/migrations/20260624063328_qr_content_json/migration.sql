/*
  Warnings:

  - You are about to drop the column `destinationUrl` on the `qr` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspaceId,name]` on the table `Folder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[folderId,name]` on the table `QR` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `qr` DROP COLUMN `destinationUrl`,
    ADD COLUMN `activeFrom` DATETIME(3) NULL,
    ADD COLUMN `activeUntil` DATETIME(3) NULL,
    ADD COLUMN `content` JSON NOT NULL,
    ADD COLUMN `expiresAt` DATETIME(3) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `qrscan` ADD COLUMN `browser` VARCHAR(191) NULL,
    ADD COLUMN `device` VARCHAR(191) NULL,
    ADD COLUMN `language` VARCHAR(191) NULL,
    ADD COLUMN `os` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Folder_workspaceId_name_key` ON `Folder`(`workspaceId`, `name`);

-- CreateIndex
CREATE INDEX `QR_workspaceId_folderId_idx` ON `QR`(`workspaceId`, `folderId`);

-- CreateIndex
CREATE UNIQUE INDEX `QR_folderId_name_key` ON `QR`(`folderId`, `name`);

-- CreateIndex
CREATE INDEX `QRScan_qrId_scannedAt_idx` ON `QRScan`(`qrId`, `scannedAt`);

-- CreateIndex
CREATE INDEX `QRScan_country_idx` ON `QRScan`(`country`);

-- CreateIndex
CREATE INDEX `QRScan_city_idx` ON `QRScan`(`city`);
