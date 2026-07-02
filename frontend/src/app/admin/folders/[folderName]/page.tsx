import { QRsPage } from "./client";

export default async function FolderContents({
  params,
}: {
  params: Promise<{ folderName: string }>;
}) {
  const { folderName } = await params;
  return <QRsPage folderName={folderName} />;
}
