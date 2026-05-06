import type { GeneratorConfig } from "@/types/config";
import { defaultConfig } from "@/types/config";

export type ProfileId =
  | "minimal"
  | "gaming"
  | "performance"
  | "gaming-performance"
  | "gaming-performance-productivity"
  | "ultra-light"
  | "productivity"
  | "privacy";

export interface ProfileDefinition {
  id: ProfileId;
  /** Nombre mostrado en la UI */
  label: string;
  /** Una frase que resume el uso */
  summary: string;
  /** Combina valores por encima del restablecimiento (no sustituye campos locales) */
  patch: Partial<GeneratorConfig>;
}

/** Perfiles aplican sólo switches conocidos por esta app (subconjunto del generador de referencia). */
export const PROFILE_DEFINITIONS: ProfileDefinition[] = [
  {
    id: "minimal",
    label: "Mínimo",
    summary:
      "Sólo lo esencial: idioma, cuenta local, zona horaria y poca automatización OOBE.",
    patch: {},
  },
  {
    id: "gaming",
    label: "Gaming",
    summary:
      "Interfaz + puntero, y paquete FirstLogon (quitar Apps típicas, Copilot, Recall, algunos servicios, OneDrive, Edge boost). Mantén Defender/Actualizaciones intactos.",
    patch: {
      disableEnhancePointerPrecision: true,
      disableGameBarTips: true,
      disableSuggestionsStart: true,
      hideWidgetsTaskbar: true,
      flRemovePreinstalledAppx: true,
      flDisableSilentInstalledApps: true,
      flDisableCopilot: true,
      flDisableRecall: true,
      flDisableDiagTrack: true,
      flDisableFax: true,
      flDisableXblGameSave: true,
      flUninstallOneDrive: true,
      flDisableEdgeStartupBoost: true,
    },
  },
  {
    id: "performance",
    label: "Rendimiento",
    summary:
      "Rutinas que suelen mejorar tiempo de disco (último acceso) y evitar Fast Startup.",
    patch: {
      disableLastAccessTimestamp: true,
      disableFastStartup: true,
      adjustVisualEffectsPerformance: true,
    },
  },
  {
    id: "gaming-performance",
    label: "Gaming + Rendimiento",
    summary:
      "Gaming + rendimiento en disco/UI; incluye el mismo paquete FirstLogon opcional que el perfil Gaming.",
    patch: {
      disableEnhancePointerPrecision: true,
      disableGameBarTips: true,
      disableSuggestionsStart: true,
      hideWidgetsTaskbar: true,
      disableLastAccessTimestamp: true,
      disableFastStartup: true,
      adjustVisualEffectsPerformance: true,
      flRemovePreinstalledAppx: true,
      flDisableSilentInstalledApps: true,
      flDisableCopilot: true,
      flDisableRecall: true,
      flDisableDiagTrack: true,
      flDisableFax: true,
      flDisableXblGameSave: true,
      flUninstallOneDrive: true,
      flDisableEdgeStartupBoost: true,
    },
  },
  {
    id: "gaming-performance-productivity",
    label: "Gaming + Rendimiento + Productividad",
    summary:
      "Rendimiento disco/UI + paquete FirstLogon tipo gaming (Copilot, Recall, Fax, Xbox save, OneDrive, Edge boost, Appx…). Capa productividad: Explorer útil, barra a la izquierda, rutas largas, experiencias dirigidas off, SmartScreen on y telemetría más moderada (sin DiagTrack disabled ni AllowTelemetry forzado).",
    patch: {
      disableEnhancePointerPrecision: true,
      disableGameBarTips: true,
      disableSuggestionsStart: true,
      hideWidgetsTaskbar: true,
      disableLastAccessTimestamp: true,
      disableFastStartup: true,
      adjustVisualEffectsPerformance: true,
      explorerShowExtensions: true,
      explorerOpenToThisPc: true,
      taskbarLeftAlignWin11: true,
      enableLongPaths: true,
      minimizeTelemetry: false,
      disableConsumerFeatures: true,
      disableSmartScreenWarn: false,
      flRemovePreinstalledAppx: true,
      flDisableSilentInstalledApps: true,
      flDisableCopilot: true,
      flDisableRecall: true,
      flDisableFax: true,
      flDisableXblGameSave: true,
      flUninstallOneDrive: true,
      flDisableEdgeStartupBoost: true,
    },
  },
  {
    id: "ultra-light",
    label: "Ultra ligero",
    summary:
      "Modo oscuro + sin transparencias, puntero sin aceleración, quitar Mapas/móvil/impresión (Spooler off), menos popups de accesibilidad, gaming‑debloat completo y efectos al mínimo. Prueba en VM: sin impresión hasta reactivar Spooler.",
    patch: {
      darkModeAppsAndSystem: true,
      disableTransparencyEffects: true,
      disableEnhancePointerPrecision: true,
      adjustVisualEffectsPerformance: true,
      disableLastAccessTimestamp: true,
      disableFastStartup: true,
      hideWidgetsTaskbar: true,
      disableGameBarTips: true,
      disableSuggestionsStart: true,
      minimizeTelemetry: true,
      disableConsumerFeatures: true,
      hideOnlineAccountScreens: true,
      explorerShowExtensions: true,
      explorerOpenToThisPc: true,
      flRemoveMapsApp: true,
      flRemovePhoneLinkApp: true,
      flDisablePrintSpooler: true,
      reduceAccessibilityShortcutPrompts: true,
      flRemovePreinstalledAppx: true,
      flDisableSilentInstalledApps: true,
      flDisableCopilot: true,
      flDisableRecall: true,
      flDisableDiagTrack: true,
      flDisableFax: true,
      flDisableXblGameSave: true,
      flUninstallOneDrive: true,
      flDisableEdgeStartupBoost: true,
    },
  },
  {
    id: "productivity",
    label: "Productividad",
    summary:
      "Explorer claro para trabajar, telemetría moderada pero sin el modo “privacy extremo”; SmartScreen recomendado encendido.",
    patch: {
      explorerShowExtensions: true,
      explorerOpenToThisPc: true,
      taskbarLeftAlignWin11: true,
      enableLongPaths: true,
      minimizeTelemetry: false,
      disableConsumerFeatures: true,
      disableSmartScreenWarn: false,
      adjustVisualEffectsPerformance: false,
    },
  },
  {
    id: "privacy",
    label: "Privacidad fuerte",
    summary:
      "Telemetría mínima, experiencias dirigidas, ID publicidad, línea de tiempo y experiencias diagnosticadas; Windows Update manual (parches bajo tu control). SmartScreen se mantiene.",
    patch: {
      minimizeTelemetry: true,
      disableConsumerFeatures: true,
      disableSuggestionsStart: true,
      hideWidgetsTaskbar: true,
      disableSmartScreenWarn: false,
      privacyDisableAdvertisingIdPolicy: true,
      privacyDisablePublishUserActivities: true,
      privacyDisableTailoredExperiencesWithDiagnosticData: true,
      windowsUpdateMode: "manual",
    },
  },
];

export function applyProfile(
  profileId: ProfileId | null,
  base?: GeneratorConfig,
): GeneratorConfig {
  const start = { ...(base ?? defaultConfig) };
  if (!profileId) return start;
  const def = PROFILE_DEFINITIONS.find((p) => p.id === profileId);
  if (!def) return start;
  return { ...start, ...def.patch };
}
