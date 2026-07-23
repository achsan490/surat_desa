import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  trend?: string;
  accentGradient?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  colorClass,
  bgClass,
  trend,
  accentGradient,
}: StatCardProps) {
  return (
    <Card className="relative overflow-hidden border border-slate-200/80 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 rounded-2xl">
      {/* Top accent line if gradient provided */}
      {accentGradient && (
        <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", accentGradient)} />
      )}

      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
            <p className={cn("text-3xl font-extrabold tracking-tight", colorClass)}>
              {value.toLocaleString("id-ID")}
            </p>
            {trend && (
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full mt-1">
                <span>{trend}</span>
              </div>
            )}
          </div>

          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm flex-shrink-0 transition-transform group-hover:scale-105",
              bgClass
            )}
          >
            <Icon className={cn("h-6 w-6", colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
