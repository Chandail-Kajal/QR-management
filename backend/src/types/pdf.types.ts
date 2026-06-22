export interface IDocketPdf {
  companyGstNo: string;
  companyPhone: string;
  companyEmail: string;

  withLogo: boolean;

  origin: string;
  destination: string;

  bookingDate?: string;
  creditAmt?: number | string;
  piecies?: number | string;

  consignor: string;
  consignorAddress: string;

  consignee: string;
  consigneeAddress: string;

  invoiceNo: string;
  invoiceVal: number | string;

  codAmt: number | string;

  docketNumber: string;

  totalActualWeight: number | string;
  totalChargedWeight: number | string;

  bookingType: "cash" | "credit" | "topay" | "";
}

type TDocket = {
  docketNumber: string;
  date: string;

  origin: string;
  destination: string;

  client: string;
  consignee: string;

  pieces: number | string;
  weight: number | string;

  toPay: number | string;
  cod: number | string;
};

export interface IManifestPdf {
  printedAt: string;
  data: TDocket[];
  totalpieces: string | number;
  totalWeight: string | number;
  totalToPay: string | number;
  totalCod: string | number;
  mode: string;
  branch: string;
  destination: string;
  vendor: string;
  totalDockets: number;
  manifestDate: string;
  manifestNumber: string;
}

export interface IRunsheetPdf {
  docketNumber: string;

  consignor: string;
  origin: string;

  consignee: string;
  destination: string;

  pcs: number | string;
  weight: number | string;

  cash: number | string;
  topay: number | string;
  cod: number | string;
}
