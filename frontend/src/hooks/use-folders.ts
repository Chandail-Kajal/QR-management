import { useQuery } from "@tanstack/react-query";
import { getFolders } from "@/services/folder.service";

export function useFolders(page: number, search: string, workspaceId: number) {
  return useQuery({
    queryKey: ["folders", page, search, workspaceId],
    queryFn: () =>
      getFolders({
        page,
        limit: 10,
        search,
      }),
  });
}
