/** Country code + dial code + flag. Kenya first (default). */
export const COUNTRY_PHONE_LIST = [
  { code: "KE", dial: "+254", name: "Kenya", flag: "🇰🇪" },
  { code: "TZ", dial: "+255", name: "Tanzania", flag: "🇹🇿" },
  { code: "UG", dial: "+256", name: "Uganda", flag: "🇺🇬" },
  { code: "RW", dial: "+250", name: "Rwanda", flag: "🇷🇼" },
  { code: "ET", dial: "+251", name: "Ethiopia", flag: "🇪🇹" },
  { code: "NG", dial: "+234", name: "Nigeria", flag: "🇳🇬" },
  { code: "ZA", dial: "+27", name: "South Africa", flag: "🇿🇦" },
  { code: "GH", dial: "+233", name: "Ghana", flag: "🇬🇭" },
  { code: "EG", dial: "+20", name: "Egypt", flag: "🇪🇬" },
  { code: "US", dial: "+1", name: "United States", flag: "🇺🇸" },
  { code: "GB", dial: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "IN", dial: "+91", name: "India", flag: "🇮🇳" },
  { code: "AE", dial: "+971", name: "UAE", flag: "🇦🇪" },
  { code: "CA", dial: "+1", name: "Canada", flag: "🇨🇦" },
  { code: "DE", dial: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "FR", dial: "+33", name: "France", flag: "🇫🇷" },
] as const;

const DIAL_TO_ENTRY = Object.fromEntries(
  COUNTRY_PHONE_LIST.filter((c) => c.dial).map((c) => [c.dial, c])
);

/** Parse full number e.g. "+254712345678" -> { dial: "+254", national: "712345678" }. Defaults to Kenya. */
export function parsePhoneFull(full: string | null | undefined): { dial: string; national: string } {
  const def = COUNTRY_PHONE_LIST[0];
  if (!full || typeof full !== "string") return { dial: def.dial, national: "" };
  const trimmed = full.trim();
  if (!trimmed) return { dial: def.dial, national: "" };
  if (!trimmed.startsWith("+")) return { dial: def.dial, national: trimmed.replace(/\D/g, "") };
  for (let len = 4; len >= 2; len--) {
    const dial = trimmed.slice(0, len);
    if (DIAL_TO_ENTRY[dial]) {
      const national = trimmed.slice(len).replace(/\D/g, "");
      return { dial, national };
    }
  }
  return { dial: def.dial, national: trimmed.replace(/\D/g, "") };
}

/** Combine dial + national (digits only) for storage. */
export function combinePhone(dial: string, national: string): string {
  const digits = national.replace(/\D/g, "");
  if (!digits) return "";
  return dial ? `${dial}${digits}` : digits;
}
