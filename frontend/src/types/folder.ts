import { QRType } from "./qr";

export type TFolderDTO = {
  id: number;
  name: string;
  qrCount: number;
  totalScans: number;
  previewTypes: QRType[];
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type TCreateFolderDTO = {
  name: string;
};

export type TUpdateFolderDTO = TCreateFolderDTO
