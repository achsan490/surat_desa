import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { JENIS_SURAT_CONFIG } from "@/types";
import type { JenisSuratKey } from "@/types";

interface DynamicFormFieldsProps {
  jenisSurat: JenisSuratKey | "";
  values: Record<string, string>;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export function DynamicFormFields({
  jenisSurat,
  values,
  onChange,
  errors = {},
}: DynamicFormFieldsProps) {
  if (!jenisSurat) return null;

  const config = JENIS_SURAT_CONFIG[jenisSurat];
  if (!config) return null;

  return (
    <div className="space-y-4 rounded-xl border border-blue-100 bg-blue-50/40 p-5">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
        Data Tambahan — {config.label}
      </p>
      {config.fields.map((field) => (
        <div key={field.name} className="space-y-1.5">
          <Label htmlFor={`custom-${field.name}`} className="text-sm font-medium text-slate-700">
            {field.label}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {field.type === "textarea" ? (
            <Textarea
              id={`custom-${field.name}`}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="bg-white min-h-[80px] resize-none"
              rows={3}
            />
          ) : (
            <Input
              id={`custom-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              value={values[field.name] ?? ""}
              onChange={(e) => onChange(field.name, e.target.value)}
              className="bg-white"
            />
          )}
          {errors[field.name] && (
            <p className="text-xs text-red-500">{errors[field.name]}</p>
          )}
        </div>
      ))}
    </div>
  );
}
