import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRY_PHONE_LIST, parsePhoneFull, combinePhone } from "@/lib/country-codes";
import { cn } from "@/lib/utils";

type Props = {
  value: string;
  onChange: (full: string) => void;
  label: React.ReactNode;
  placeholder?: string;
  id?: string;
  className?: string;
};

export default function PhoneWithCountryInput({ value, onChange, label, placeholder = "700 000 000", id, className }: Props) {
  const parsed = parsePhoneFull(value);
  const [dial, setDial] = useState(parsed.dial);
  const [national, setNational] = useState(parsed.national);

  useEffect(() => {
    const p = parsePhoneFull(value);
    setDial(p.dial);
    setNational(p.national);
  }, [value]);

  const notify = (newDial: string, newNational: string) => {
    onChange(combinePhone(newDial, newNational));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className="flex items-center gap-1.5 text-foreground font-medium">{label}</Label>
      <div className="flex rounded-xl border border-border bg-card overflow-hidden shadow-xs focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all">
        <Select
          value={dial || COUNTRY_PHONE_LIST[0].dial}
          onValueChange={(v) => {
            setDial(v);
            notify(v, national);
          }}
        >
          <SelectTrigger
            id={id}
            className="w-[7.5rem] sm:w-[8.5rem] shrink-0 rounded-none border-0 border-r border-border bg-muted/40 focus:ring-0 focus:ring-offset-0 h-11 rounded-l-xl [&>span]:flex [&>span]:items-center [&>span]:gap-1.5"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="max-h-[280px]">
            {COUNTRY_PHONE_LIST.map((c) => (
              <SelectItem key={c.code} value={c.dial} className="flex items-center gap-2 py-2.5">
                <span className="text-lg leading-none">{c.flag}</span>
                <span className="font-semibold tabular-nums">{c.dial}</span>
                <span className="text-muted-foreground text-sm">{c.name}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          type="tel"
          inputMode="numeric"
          placeholder={placeholder}
          value={national}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(0, 15);
            setNational(v);
            notify(dial, v);
          }}
          className="flex-1 min-w-0 rounded-none border-0 bg-transparent focus-visible:ring-0 h-11 placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}
