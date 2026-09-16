import { ALL_QR_TYPES } from "@/lib/all-qr-types";
import { useAuthStore } from "@/stores/auth.store";
import { QRType } from "@/types";

export const usePlanQrTypes = () => {
  const plan = useAuthStore((s) => s.subscription);
  return plan?.allowedQRTypes as QRType[] || ALL_QR_TYPES;
};

