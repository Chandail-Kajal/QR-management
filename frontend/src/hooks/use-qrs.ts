import { useQuery } from "@tanstack/react-query";
import { getQRs } from "@/services/qr.service";

export function useQRs(page: number, search: string, status?: string) {
  return useQuery({
    queryKey: ["qrs", page, search, status],
    queryFn: () =>
      getQRs({
        page,
        limit: 10,
        search,
        status,
      }),
  });
}