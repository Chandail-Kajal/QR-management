import { QRAnalyticsPage } from "@/components/analytics/analytics-page";


export default async function name({
  params,
}: {
  params: Promise<{ qrId: number | string; folderName: string }>;
}) {
  const { qrId, folderName } = await params;
  return <QRAnalyticsPage qrId={qrId as string} folderName={folderName} />;
}
