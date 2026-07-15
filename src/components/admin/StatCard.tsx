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
}

export function StatCard({ label, value, icon: Icon, colorClass, bgClass, trend }: StatCardProps) {
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{label}</p>
            <p className={cn("text-3xl font-bold", colorClass)}>{value.toLocaleString("id-ID")}</p>
            {trend && <p className="text-xs text-slate-400">{trend}</p>}
          </div>
          <div className={cn("flex h-12 w-12 items-center justify-center rounded-xl", bgClass)}>
            <Icon className={cn("h-6 w-6", colorClass)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
