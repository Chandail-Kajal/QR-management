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

const styles: Record<QRStatus, string> = {
  ACTIVE:
  "!bg-[#166534] !text-white !border-[#14532D] [&_svg]:!text-white",

PAUSED:
  "!bg-[#92400E] !text-white !border-[#78350F] [&_svg]:!text-white",

ARCHIVED:
  "!bg-[#991B1B] !text-white !border-[#7F1D1D] [&_svg]:!text-white",
};

const dotColors: Record<QRStatus, string> = {
  ACTIVE: "bg-[#4FD8A8] shadow-[0_0_4px_#4FD8A8]",
  PAUSED: "bg-[#FFC470] shadow-[0_0_4px_#FFC470]",
  ARCHIVED: "bg-[#FF6B6B] shadow-[0_0_4px_#FF6B6B]",
};

export function QRStatusBadge({ status }: { status: QRStatus }) {
  return (
    <Badge
      variant={variants[status]}
      className={`gap-1.5 font-medium rounded-full px-2.5 py-0.5 ${styles[status]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dotColors[status]}`} />
      {labels[status]}
    </Badge>
  );
}
