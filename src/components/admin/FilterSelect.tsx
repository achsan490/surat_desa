"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FilterSelectProps {
  defaultValue: string;
}

export function FilterSelect({ defaultValue }: FilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!value || value === "ALL") {
      params.delete("status");
    } else {
      params.set("status", value);
    }
    router.push(`/admin/dashboard?${params.toString()}`);
  };

  return (
    <Select value={defaultValue} onValueChange={handleValueChange}>
      <SelectTrigger className="bg-white h-9 text-xs w-[180px]">
        <SelectValue placeholder="Semua Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ALL">Semua Status</SelectItem>
        <SelectItem value="PENDING">Menunggu Verifikasi</SelectItem>
        <SelectItem value="APPROVED">Disetujui</SelectItem>
        <SelectItem value="REJECTED">Ditolak</SelectItem>
      </SelectContent>
    </Select>
  );
}
