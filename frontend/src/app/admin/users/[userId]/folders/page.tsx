import { FoldersPage } from "@/components/folders-page";

export default async function FolderContents({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return <FoldersPage userId={userId} />;
}
