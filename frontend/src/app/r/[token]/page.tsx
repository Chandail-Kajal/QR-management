import QRRedirectClient from "./QrRedirectClient";

export default async function Page({ params }: { params: { token: string } }) {
  const { token } = await params;
  return <QRRedirectClient token={token} />;
}
