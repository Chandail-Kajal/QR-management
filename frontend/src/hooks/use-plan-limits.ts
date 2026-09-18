import { ALL_QR_TYPES } from "@/lib/all-qr-types";
import { useAuthStore } from "@/stores/auth.store";
import { QRType } from "@/types";

export const usePlanQrTypes = (): QRType[] => {
  const plan = useAuthStore((s) => s.subscription);

  if (!plan) return ALL_QR_TYPES;

  let types = plan.allowedQRTypes;

  // Defensive: parse if it's a JSON string (e.g. from stale localStorage)
  if (typeof types === "string") {
    try {
      types = JSON.parse(types);
    } catch {
      return ALL_QR_TYPES;
    }
  }

  // If the plan has allowed types configured, use them; otherwise fall back to all
  if (Array.isArray(types) && types.length > 0) {
    return types as QRType[];
  }

  return ALL_QR_TYPES;
};

