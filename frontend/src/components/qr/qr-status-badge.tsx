import { Badge } from "@/components/ui/badge";
import { QRStatus } from "@/types";

const labels: Record<QRStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  ARCHIVED: "Archived",
};

const variants: Record<QRStatus, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  PAUSED: "secondary",
  ARCHIVED: "destructive",
};

export function QRStatusBadge({ status }: { status: QRStatus }) {
  return <Badge variant={variants[status]}>{labels[status]}</Badge>;
}
