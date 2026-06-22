import { api } from "@/lib/api";
import { GetQRsResponseDTO } from "@/types";
import { CreateQRRequestDTO, QRDTO } from "@/types";

interface Params {
  page: number;
  limit: number;
  search?: string;
  status?: string;
}

export async function getQRs(params: Params): Promise<GetQRsResponseDTO> {
  const res = await api.get("/qrs", {
    params,
  });

  return res.data.data;
}

export async function createQR(data: CreateQRRequestDTO): Promise<QRDTO> {
  const res = await api.post("/qrs", data);

  return res.data.data;
}
