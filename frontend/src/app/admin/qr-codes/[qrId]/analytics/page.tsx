import { QRAnalyticsPage } from "../client";

export default async function name({
  params,
}: {
  params: Promise<{ qrId: number | string }>;
}) {
  const { qrId } = await params;
  return <QRAnalyticsPage qrId={qrId as string} />;
}
