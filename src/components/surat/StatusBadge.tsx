import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle } from "lucide-react";
import type { StatusSurat } from "@/types";

interface StatusBadgeProps {
  status: StatusSurat;
  className?: string;
}

const STATUS_CONFIG = {
  PENDING: {
    label: "Menunggu Verifikasi",
    icon: Clock,
    className: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50",
  },
  APPROVED: {
    label: "Disetujui",
    icon: CheckCircle2,
    className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50",
  },
  REJECTED: {
    label: "Ditolak",
    icon: XCircle,
    className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-50",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn("flex items-center gap-1 font-medium text-xs", config.className, className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
