import { QRsPage } from "@/components/qr-code-page/qr-codes-page";

export default async function FolderContents({
  params,
}: {
  params: Promise<{ folderName: string; userId: string }>;
}) {
  const { folderName, userId } = await params;
  return <QRsPage userId={userId} folderName={folderName} />;
}
