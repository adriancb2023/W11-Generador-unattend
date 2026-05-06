/** Valores válidos para <TimeZone> en unattend (nombres de Windows). */
export const TIMEZONE_CHOICES: { id: string; label: string }[] = [
  { id: "Romance Standard Time", label: "España peninsular (+1 CET)" },
  { id: "GMT Standard Time", label: "Canarias / Londres (+0/+1)" },
  { id: "W. Europe Standard Time", label: "Centroeuropa occidental (+1/+2)" },
  { id: "Central Standard Time", label: "México (centro) / Centroamérica parte" },
  { id: "Central America Standard Time", label: "América Central (sin DST típico)" },
  { id: "Argentina Standard Time", label: "Argentina (+3)" },
  { id: "Pacific SA Standard Time", label: "Chile (continental)" },
  { id: "SA Pacific Standard Time", label: "Colombia / Perú (sin DST típico)" },
  { id: "Mountain Standard Time", label: "México pacífico / Arizona" },
  { id: "Pacific Standard Time", label: "EE. UU. Pacífico" },
  { id: "Eastern Standard Time", label: "EE. UU. Este / parte LATAM atlántico" },
  { id: "UTC", label: "UTC" },
];

export const LANGUAGE_CHOICES: { id: string; label: string; keyboardPe: string }[] =
  [
    { id: "es-ES", label: "España (es-ES)", keyboardPe: "040a:0000040a" },
    { id: "es-MX", label: "México (es-MX)", keyboardPe: "080a:0000080a" },
    { id: "es-419", label: "Español LATAM (es-419, si está en ISO)", keyboardPe: "080a:0000080a" },
    { id: "en-US", label: "Inglés EE. UU.", keyboardPe: "0409:00000409" },
  ];
