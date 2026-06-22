export type QRType = "URL";

export type QRStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export interface QRDTO {
  id: number;
  name: string;
  token: string;

  type: QRType;

  destinationUrl: string;

  status: QRStatus;

  scanCount: number;
  scanLimit: number | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateQRRequestDTO {
  name: string;
  destinationUrl: string;
  scanLimit?: number | null;
}

export interface CreateQRResponseDTO {
  qr: QRDTO;
}

export interface UpdateQRRequestDTO {
  name?: string;
  destinationUrl?: string;
  status?: QRStatus;
  scanLimit?: number | null;
}

export interface UpdateQRResponseDTO {
  qr: QRDTO;
}

export interface GetQRsRequestDTO {
  page?: number;
  limit?: number;
  search?: string;
  status?: QRStatus;
}

export interface GetQRsResponseDTO {
  items: QRDTO[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetQRResponseDTO {
  qr: QRDTO;
}

export interface DeleteQRResponseDTO {
  success: true;
}

export type QRDownloadFormat = "PNG" | "SVG" | "PDF";

export interface QRAnalyticsDTO {
  totalScans: number;

  lastScanAt: string | null;

  scansByDay: {
    date: string;
    count: number;
  }[];
}
