import { QRsPage } from "@/components/qr-code-page/client";

export default async function FolderContents({
  params,
}: {
  params: Promise<{ folderName: string }>;
}) {
  const { folderName } = await params;
  return <QRsPage folderName={folderName} />;
}
