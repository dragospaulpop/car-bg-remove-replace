import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback } from "react";

interface InputFileProps {
  label: string;
  onChange: (file: File) => void;
}

export function InputFile({ label, onChange }: InputFileProps) {
  const setCarPhoto = useCallback(
    (file: File | undefined) => {
      if (file) {
        onChange(file);
      }
    },
    [onChange]
  );

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="picture">{label}</Label>
      <Input
        id="picture"
        type="file"
        onChange={(e) => setCarPhoto(e.target.files?.[0])}
      />
    </div>
  );
}
