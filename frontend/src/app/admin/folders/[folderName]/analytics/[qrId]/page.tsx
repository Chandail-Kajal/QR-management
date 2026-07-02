import { QRAnalyticsPage } from "./client";

export default async function name({
  params,
}: {
  params: Promise<{ qrId: number | string; folderName: string }>;
}) {
  const { qrId, folderName } = await params;
  return <QRAnalyticsPage qrId={qrId as string} folderName={folderName} />;
}
