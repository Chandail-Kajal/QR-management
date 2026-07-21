import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/services/folder.service";

export function useFolders(page: number, search: string) {
  return useQuery({
    queryKey: ["folders", page, search],
    queryFn: () =>
      getFolders({
        page,
        limit: 10,
        search,
      }),
  });
}
