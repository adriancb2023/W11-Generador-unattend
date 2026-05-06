export type ThemeMode = "light" | "dark" | "system";

/** Política Windows Update vía registro (AU). */
export type WindowsUpdatePolicyMode =
  | "default"
  /** AUOptions = 2: aviso antes de descargar e instalar */
  | "notify"
  /** NoAutoUpdate = 1: no automático; el usuario busca actualizaciones en Configuración */
  | "manual";

export interface GeneratorConfig {
  /** Idioma de instalación Windows (ej. es-ES) */
  uiLanguage: string;
  /** Disposición de teclado en PE/setup; ej. Spanish: 040a:0000040a */
  inputLocalePe: string;
  /** Idioma de interfaz repetido en otros pasos */
  systemLocale: string;
  userLocale: string;
  timeZoneId: string;
  computerName: string;
  localAccountName: string;
  /** Contraseña en claro desde el formulario; se codifica a Base64 al generar XML */
  localPassword: string;
  /** Saltar OOBE cuando sea posible (cuentado local) */
  hideOnlineAccountScreens: boolean;
  hideEULA: boolean;
  networkLocationHome: boolean;

  bypassWin11Checks: boolean;
  allowOfflineLocalAccountHint: boolean;

  /** Opciones reproducidas en personalize / comandos */
  enableLongPaths: boolean;
  disableLastAccessTimestamp: boolean;
  disableFastStartup: boolean;

  minimizeTelemetry: boolean;
  disableConsumerFeatures: boolean;
  hideWidgetsTaskbar: boolean;

  /** Directivas HKLM adicionales de privacidad */
  privacyDisableAdvertisingIdPolicy: boolean;
  privacyDisablePublishUserActivities: boolean;
  privacyDisableTailoredExperiencesWithDiagnosticData: boolean;

  /** Control de actualizaciones automáticas (manual vs avisos vs estándar) */
  windowsUpdateMode: WindowsUpdatePolicyMode;

  explorerShowExtensions: boolean;
  explorerOpenToThisPc: boolean;
  taskbarLeftAlignWin11: boolean;

  disableEnhancePointerPrecision: boolean;
  disableGameBarTips: boolean;
  disableSuggestionsStart: boolean;

  adjustVisualEffectsPerformance: boolean;
  disableSmartScreenWarn: boolean;

  /**
   * Directiva Defender: porcentaje máximo de CPU **durante análisis** (AvgCPULoadFactor).
   * 0 = no aplicar (Windows suele usar ~50%). Rango útil documentado 5–100.
   */
  defenderAvgCpuLoadFactorDuringScan: number;

  /** Apariencia: modo oscuro apps + sistema (plantilla Default + primer usuario) */
  darkModeAppsAndSystem: boolean;
  /** Quita efectos acrílicos / transparencias (algo menos GPU) */
  disableTransparencyEffects: boolean;

  /** Quitar Mapas (Appx) en primer inicio */
  flRemoveMapsApp: boolean;
  /** Quitar Vínculo con el móvil / Phone Experience (Appx) */
  flRemovePhoneLinkApp: boolean;
  /**
   * Detiene y deshabilita el servicio Cola de impresión.
   * Rompe imprimir hasta que reactives el servicio manualmente.
   */
  flDisablePrintSpooler: boolean;
  /**
   * Evita ventanas de “¿Activar Teclas adhesivas / repetición…?” (Sticky/Toggle/Filter).
   * Peor para usuarios que dependen de esos atajos.
   */
  reduceAccessibilityShortcutPrompts: boolean;

  /** --- Primer inicio (FirstLogon): paquete “debloat” equilibrado --- */
  flRemovePreinstalledAppx: boolean;
  flDisableSilentInstalledApps: boolean;
  flDisableCopilot: boolean;
  flDisableRecall: boolean;
  flDisableDiagTrack: boolean;
  flDisableFax: boolean;
  flDisableXblGameSave: boolean;
  flUninstallOneDrive: boolean;
  flDisableEdgeStartupBoost: boolean;
}

export const defaultConfig: GeneratorConfig = {
  uiLanguage: "es-ES",
  inputLocalePe: "040a:0000040a",
  systemLocale: "es-ES",
  userLocale: "es-ES",
  timeZoneId: "Romance Standard Time",
  computerName: "PC-INSTALADO",
  localAccountName: "Usuario",
  localPassword: "",
  hideOnlineAccountScreens: true,
  hideEULA: true,
  networkLocationHome: false,

  bypassWin11Checks: false,
  /** Si lo activas, mostramos un aviso en la página (no cambia más el XML solo). */
  allowOfflineLocalAccountHint: false,

  enableLongPaths: true,
  disableLastAccessTimestamp: false,
  disableFastStartup: false,

  minimizeTelemetry: true,
  disableConsumerFeatures: true,
  hideWidgetsTaskbar: true,

  privacyDisableAdvertisingIdPolicy: false,
  privacyDisablePublishUserActivities: false,
  privacyDisableTailoredExperiencesWithDiagnosticData: false,

  windowsUpdateMode: "default",

  explorerShowExtensions: true,
  explorerOpenToThisPc: true,
  taskbarLeftAlignWin11: false,

  /** Recomendado para valor DPI estable en juegos; también en plantilla Default. */
  disableEnhancePointerPrecision: true,
  disableGameBarTips: false,
  disableSuggestionsStart: false,

  adjustVisualEffectsPerformance: false,
  disableSmartScreenWarn: false,

  defenderAvgCpuLoadFactorDuringScan: 25,

  darkModeAppsAndSystem: false,
  disableTransparencyEffects: false,

  flRemoveMapsApp: false,
  flRemovePhoneLinkApp: false,
  flDisablePrintSpooler: false,
  reduceAccessibilityShortcutPrompts: false,

  flRemovePreinstalledAppx: false,
  flDisableSilentInstalledApps: false,
  flDisableCopilot: false,
  flDisableRecall: false,
  flDisableDiagTrack: false,
  flDisableFax: false,
  flDisableXblGameSave: false,
  flUninstallOneDrive: false,
  flDisableEdgeStartupBoost: false,
};
