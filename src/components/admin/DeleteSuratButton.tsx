"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteSurat } from "@/lib/actions/surat.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteSuratButtonProps {
  id: string;
  namaPemohon: string;
}

export function DeleteSuratButton({ id, namaPemohon }: DeleteSuratButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteSurat(id);
      if (result.success) {
        setOpen(false);
        router.refresh();
      } else {
        alert(result.error ?? "Gagal menghapus surat.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors ml-3"
        title="Hapus surat"
      >
        <Trash2 className="h-3.5 w-3.5" />
        Hapus
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-slate-900">Hapus Pengajuan Surat?</DialogTitle>
          <DialogDescription className="text-slate-500 text-sm pt-1">
            Anda akan menghapus pengajuan surat atas nama{" "}
            <span className="font-semibold text-slate-700">{namaPemohon}</span>.
            <br />
            <span className="text-red-500 font-medium">
              Tindakan ini tidak dapat dibatalkan.
            </span>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
            className="border-slate-300 text-slate-700"
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Ya, Hapus
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
