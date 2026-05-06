import type { GeneratorConfig } from "@/types/config";
import { encodeUnattendPassword } from "@/lib/encodePassword";
import { xmlEscape } from "@/lib/xml";

const PK = "31bf3856ad364e35";

/** Una sola línea; ejecutada en primer inicio de sesión (cuenta administrador elevada). */
const CMD_REMOVE_PREINSTALLED_APPX =
  'powershell.exe -ExecutionPolicy Bypass -Command "Get-AppxPackage *Xbox* | Remove-AppxPackage; Get-AppxPackage *Bing* | Remove-AppxPackage; Get-AppxPackage *ZuneMusic* | Remove-AppxPackage; Get-AppxPackage *ZuneVideo* | Remove-AppxPackage; Get-AppxPackage *GetHelp* | Remove-AppxPackage; Get-AppxPackage *Getstarted* | Remove-AppxPackage; Get-AppxPackage *OfficeHub* | Remove-AppxPackage; Get-AppxPackage *SolitaireCollection* | Remove-AppxPackage; Get-AppxPackage *People* | Remove-AppxPackage; Get-AppxPackage *SkypeApp* | Remove-AppxPackage; Get-AppxPackage *Clipchamp* | Remove-AppxPackage; Get-AppxPackage *Todos* | Remove-AppxPackage"';

const PERSONALIZE_REL =
  "HKU\\_UnattGen\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize";
const MOUSE_PANEL =
  "HKU\\_UnattGen\\Control Panel\\Mouse";

/**
 * Una pasada por NTUSER.DAT del usuario Default.
 * Así los **usuarios nuevos** heredan tema / ratón / menos apps promocionadas desde la plantilla.
 */
function defaultUserHiveSeedCommand(config: GeneratorConfig): string | null {
  const consumer = config.disableConsumerFeatures;
  const dark = config.darkModeAppsAndSystem;
  const noTrans = config.disableTransparencyEffects;
  const noEnhanceMouse = config.disableEnhancePointerPrecision;
  if (!consumer && !dark && !noTrans && !noEnhanceMouse) return null;

  const parts: string[] = [
    'reg load HKU\\_UnattGen "%SystemDrive%\\Users\\Default\\NTUSER.DAT"',
  ];
  if (consumer) {
    parts.push(
      'reg add "HKU\\_UnattGen\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SilentInstalledAppsEnabled /t REG_DWORD /d 0 /f',
      'reg add "HKU\\_UnattGen\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v PreInstalledAppsEnabled /t REG_DWORD /d 0 /f',
      'reg add "HKU\\_UnattGen\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SoftLandingEnabled /t REG_DWORD /d 0 /f',
    );
  }
  if (dark) {
    parts.push(
      `reg add "${PERSONALIZE_REL}" /v AppsUseLightTheme /t REG_DWORD /d 0 /f`,
      `reg add "${PERSONALIZE_REL}" /v SystemUsesLightTheme /t REG_DWORD /d 0 /f`,
    );
  }
  if (noTrans) {
    parts.push(
      `reg add "${PERSONALIZE_REL}" /v EnableTransparency /t REG_DWORD /d 0 /f`,
    );
  }
  if (noEnhanceMouse) {
    parts.push(
      `reg add "${MOUSE_PANEL}" /v MouseSpeed /t REG_SZ /d 0 /f`,
      `reg add "${MOUSE_PANEL}" /v MouseThreshold1 /t REG_SZ /d 0 /f`,
      `reg add "${MOUSE_PANEL}" /v MouseThreshold2 /t REG_SZ /d 0 /f`,
    );
  }
  parts.push("reg unload HKU\\_UnattGen");
  return `cmd.exe /c ${parts.join(" && ")}`;
}

const CMD_REMOVE_MAPS =
  'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-AppxPackage *WindowsMaps* | Remove-AppxPackage -ErrorAction SilentlyContinue"';

const CMD_REMOVE_PHONE_LINK =
  'powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Get-AppxPackage *YourPhone* | Remove-AppxPackage -ErrorAction SilentlyContinue; Get-AppxPackage *PhoneExperience* | Remove-AppxPackage -ErrorAction SilentlyContinue"';

const CMD_DISABLE_PRINT_SPOOLER =
  "cmd.exe /c sc stop Spooler & sc config Spooler start= disabled";

/** Sin ventanas emergentes de Teclas adhesivas / repetición / alternativas (valores clásicos). */
const CMD_REDUCE_A11Y_POPUPS =
  'cmd.exe /c reg add "HKCU\\Control Panel\\Accessibility\\StickyKeys" /v Flags /t REG_SZ /d 506 /f && reg add "HKCU\\Control Panel\\Accessibility\\ToggleKeys" /v Flags /t REG_SZ /d 58 /f && reg add "HKCU\\Control Panel\\Accessibility\\Keyboard Response" /v Flags /t REG_SZ /d 122 /f';

type RunCmd = { order: number; description: string; path: string };


function deploymentComponent(
  pass: "windowsPE" | "specialize",
  commands: RunCmd[],
): string {
  if (commands.length === 0) return "";
  const inner = commands
    .map(
      (c) => `
      <RunSynchronousCommand wcm:action="add">
        <Order>${c.order}</Order>
        <Description>${xmlEscape(c.description)}</Description>
        <Path>${xmlEscape(c.path)}</Path>
      </RunSynchronousCommand>`,
    )
    .join("");
  return `
    <settings pass="${pass}">
      <component name="Microsoft-Windows-Deployment" processorArchitecture="amd64" publicKeyToken="${PK}" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State">
        <RunSynchronous>${inner}
        </RunSynchronous>
      </component>
    </settings>`;
}

function firstLogonCommands(commands: RunCmd[]): string {
  if (commands.length === 0) return "";
  const inner = commands
    .map(
      (c) => `
        <SynchronousCommand wcm:action="add">
          <Order>${c.order}</Order>
          <Description>${xmlEscape(c.description)}</Description>
          <CommandLine>${xmlEscape(c.path)}</CommandLine>
        </SynchronousCommand>`,
    )
    .join("");
  return `
          <FirstLogonCommands>${inner}
          </FirstLogonCommands>`;
}

export interface BuildResult {
  xml: string;
  warnings: string[];
}

export function buildAutounattend(config: GeneratorConfig): BuildResult {
  const warnings: string[] = [];
  if (!config.localPassword) {
    warnings.push(
      "No has escrito contraseña para la cuenta local: la instalación puede fallar o quedar sin contraseña según la edición de Windows.",
    );
  }

  if (config.computerName.length > 15) {
    warnings.push(
      "El nombre del equipo debe tener 15 caracteres o menos para evitar errores de validación.",
    );
  }

  if (config.allowOfflineLocalAccountHint) {
    warnings.push(
      "Windows 11 ha cambiado varias veces el asistente de cuenta: si te bloquea sin cuenta Microsoft, prepara políticas adicionales o una ISO/edición compatibles.",
    );
  }

  const anyOptionalDebloat =
    config.flRemovePreinstalledAppx ||
    config.flDisableSilentInstalledApps ||
    config.flDisableCopilot ||
    config.flDisableRecall ||
    config.flDisableDiagTrack ||
    config.flDisableFax ||
    config.flDisableXblGameSave ||
    config.flUninstallOneDrive ||
    config.flDisableEdgeStartupBoost ||
    config.flRemoveMapsApp ||
    config.flRemovePhoneLinkApp ||
    config.flDisablePrintSpooler ||
    config.reduceAccessibilityShortcutPrompts;

  if (anyOptionalDebloat) {
    warnings.push(
      config.windowsUpdateMode === "manual"
        ? "Debloat en primer inicio: prueba en VM. Has elegido Windows Update **manual**: instala parches de seguridad tú mismo con regularidad. Defender/WMI/SysMain/SearchIndexer no se tocan desde el bloque debloat."
        : "Debloat en primer inicio: prueba en VM. Evita scripts extremos (AtlasOS/ReviOS), quitar Store o Edge por completo, WinSxS a mano y Remove-AppxProvisionedPackage agresivo: puede romper herramientas (WSL, Docker, VS, Android Studio). El modo Windows Update lo configuras aparte; Defender/SysMain/SearchIndexer no se desactivan desde este bloque.",
    );
  }
  if (config.windowsUpdateMode === "manual") {
    warnings.push(
      "Windows Update «manual» (NoAutoUpdate): Windows no descargará ni instalará actualizaciones solo; revisa Windows Update en Configuración cuando puedas (seguridad acumulativa, controladores de pantalla, etc.).",
    );
  }
  if (config.windowsUpdateMode === "notify") {
    warnings.push(
      "Windows Update «solo notificar»: te pedirá confirmación antes de descargar e instalar; sigue pendiente de avisos del sistema.",
    );
  }
  if (config.flDisableRecall) {
    warnings.push(
      'Recall puede no existir en tu compilación o el nombre de característica puede variar; "dism /online ... Recall" puede devolver error sin impacto en el resto.',
    );
  }
  if (config.flDisablePrintSpooler) {
    warnings.push(
      "Has elegido desactivar la cola de impresión (Spooler): no podrás imprimir ni PDF «como impresora» hasta volver a poner el servicio en Automático/Manual y arrancarlo.",
    );
  }
  if (config.reduceAccessibilityShortcutPrompts) {
    warnings.push(
      "Se silencian avisos de Teclas adhesivas / alternativas y similares: si alguien usa esas funciones de accesibilidad, quítalas de primer inicio y configura Windows con calma.",
    );
  }

  const peRuns: RunCmd[] = [];
  let orderPe = 1;
  if (config.bypassWin11Checks) {
    warnings.push(
      "Saltar requisitos de Windows 11 es experimental: comprueba tu ISO/edición y haz pruebas en VM antes de un PC real.",
    );
    const base = "reg add HKLM\\SYSTEM\\Setup\\LabConfig";
    peRuns.push(
      {
        order: orderPe++,
        description: "LabConfig BypassTPMCheck",
        path: `${base} /v BypassTPMCheck /t REG_DWORD /d 1 /f`,
      },
      {
        order: orderPe++,
        description: "LabConfig BypassSecureBootCheck",
        path: `${base} /v BypassSecureBootCheck /t REG_DWORD /d 1 /f`,
      },
      {
        order: orderPe++,
        description: "LabConfig BypassRAMCheck",
        path: `${base} /v BypassRAMCheck /t REG_DWORD /d 1 /f`,
      },
    );
  }

  const specRuns: RunCmd[] = [];
  let orderSp = 1;
  if (config.enableLongPaths) {
    specRuns.push({
      order: orderSp++,
      description: "Habilitar rutas largas (LongPathsEnabled)",
      path: "reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\FileSystem /v LongPathsEnabled /t REG_DWORD /d 1 /f",
    });
  }
  if (config.disableFastStartup) {
    specRuns.push({
      order: orderSp++,
      description: "Desactivar inicio rápido (HiberbootEnabled)",
      path: "reg add HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Power /v HiberbootEnabled /t REG_DWORD /d 0 /f",
    });
  }
  if (config.disableLastAccessTimestamp) {
    specRuns.push({
      order: orderSp++,
      description: "fsutil disablelastaccess",
      path: "cmd.exe /c fsutil behavior set disablelastaccess 1",
    });
  }
  if (config.minimizeTelemetry) {
    specRuns.push({
      order: orderSp++,
      description: "Reducir telemetría (AllowTelemetry política)",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\DataCollection" /v AllowTelemetry /t REG_DWORD /d 0 /f',
    });
  }
  if (config.disableConsumerFeatures) {
    specRuns.push({
      order: orderSp++,
      description: "Desactivar experiencias dirigidas (CloudContent)",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableWindowsConsumerFeatures /t REG_DWORD /d 1 /f',
    });
  }
  if (config.privacyDisableAdvertisingIdPolicy) {
    specRuns.push({
      order: orderSp++,
      description: "Privacidad: ID de publicidad desactivado por directiva",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo" /v DisabledByGroupPolicy /t REG_DWORD /d 1 /f',
    });
  }
  if (config.privacyDisablePublishUserActivities) {
    specRuns.push(
      {
        order: orderSp++,
        description: "Privacidad: no publicar actividades en la línea de tiempo",
        path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v PublishUserActivities /t REG_DWORD /d 0 /f',
      },
      {
        order: orderSp++,
        description: "Privacidad: no subir historial de actividades",
        path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v UploadUserActivities /t REG_DWORD /d 0 /f',
      },
    );
  }
  if (config.privacyDisableTailoredExperiencesWithDiagnosticData) {
    specRuns.push({
      order: orderSp++,
      description:
        "Privacidad: desactivar experiencias diagnosticadas personalizadas",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\CloudContent" /v DisableTailoredExperiencesWithDiagnosticData /t REG_DWORD /d 1 /f',
    });
  }
  if (config.windowsUpdateMode === "notify") {
    specRuns.push({
      order: orderSp++,
      description:
        "Windows Update: notificar antes de descargar e instalar (AUOptions 2)",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v AUOptions /t REG_DWORD /d 2 /f',
    });
  }
  if (config.windowsUpdateMode === "manual") {
    specRuns.push({
      order: orderSp++,
      description:
        "Windows Update: sin actualización automática — sólo búsqueda manual",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU" /v NoAutoUpdate /t REG_DWORD /d 1 /f',
    });
  }
  const defaultHiveSeed = defaultUserHiveSeedCommand(config);
  if (defaultHiveSeed) {
    specRuns.push({
      order: orderSp++,
      description:
        "Plantilla Default (NTUSER.DAT): consumo / tema / transparencias / ratón",
      path: defaultHiveSeed,
    });
  }
  if (config.disableSmartScreenWarn) {
    specRuns.push({
      order: orderSp++,
      description: "Desactivar SmartScreen en_shell (directiva)",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System" /v EnableSmartScreenInShell /t REG_DWORD /d 0 /f',
    });
  }

  if (config.defenderAvgCpuLoadFactorDuringScan > 0) {
    let pct = Math.round(config.defenderAvgCpuLoadFactorDuringScan);
    if (pct < 5) {
      warnings.push(
        "Defender AvgCPULoadFactor: valores por debajo de 5 no son válidos para esta directiva; se usará 5.",
      );
      pct = 5;
    }
    if (pct > 100) {
      pct = 100;
    }
    warnings.push(
      "AvgCPULoadFactor limita el uso **medio de CPU mientras Defender ejecuta un análisis**; no reduce RAM ni el trabajo de protección en tiempo real al 25 %. Los análisis completos pueden tardar más.",
    );
    specRuns.push({
      order: orderSp++,
      description: `Defender: máx. ${pct}% CPU durante análisis (AvgCPULoadFactor)`,
      path: `reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\Scan" /v AvgCPULoadFactor /t REG_DWORD /d ${pct} /f`,
    });
  }

  const flRuns: RunCmd[] = [];
  let orderFl = 1;
  if (config.explorerShowExtensions) {
    flRuns.push({
      order: orderFl++,
      description: "Mostrar extensiones de archivo",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v HideFileExt /t REG_DWORD /d 0 /f',
    });
  }
  if (config.explorerOpenToThisPc) {
    flRuns.push({
      order: orderFl++,
      description: "Explorador abre en Este equipo",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v LaunchTo /t REG_DWORD /d 1 /f',
    });
  }
  if (config.taskbarLeftAlignWin11) {
    flRuns.push({
      order: orderFl++,
      description: "Barra de tareas alineada a la izquierda (Win11)",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarAl /t REG_DWORD /d 0 /f',
    });
  }
  if (config.hideWidgetsTaskbar) {
    flRuns.push({
      order: orderFl++,
      description: "Ocultar widgets en la barra (TaskbarDa)",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced" /v TaskbarDa /t REG_DWORD /d 0 /f',
    });
  }
  if (config.darkModeAppsAndSystem) {
    flRuns.push(
      {
        order: orderFl++,
        description: "Modo oscuro — aplicaciones",
        path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v AppsUseLightTheme /t REG_DWORD /d 0 /f',
      },
      {
        order: orderFl++,
        description: "Modo oscuro — sistema",
        path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v SystemUsesLightTheme /t REG_DWORD /d 0 /f',
      },
    );
  }
  if (config.disableTransparencyEffects) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar transparencias (Menos efectos visuales)",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Themes\\Personalize" /v EnableTransparency /t REG_DWORD /d 0 /f',
    });
  }
  if (config.disableEnhancePointerPrecision) {
    flRuns.push(
      {
        order: orderFl++,
        description: "Ratón — desactivar precisión mejorada (1/3)",
        path: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseSpeed /t REG_SZ /d 0 /f',
      },
      {
        order: orderFl++,
        description: "Ratón — desactivar precisión mejorada (2/3)",
        path: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold1 /t REG_SZ /d 0 /f',
      },
      {
        order: orderFl++,
        description: "Ratón — desactivar precisión mejorada (3/3)",
        path: 'reg add "HKCU\\Control Panel\\Mouse" /v MouseThreshold2 /t REG_SZ /d 0 /f',
      },
    );
  }
  if (config.disableGameBarTips) {
    flRuns.push(
      {
        order: orderFl++,
        description: "Game DVR — AppCaptureDisabled",
        path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\GameDVR" /v AppCaptureEnabled /t REG_DWORD /d 0 /f',
      },
      {
        order: orderFl++,
        description: "Game DVR — GameDVR_Enabled",
        path: 'reg add "HKCU\\System\\GameConfigStore" /v GameDVR_Enabled /t REG_DWORD /d 0 /f',
      },
    );
  }
  if (config.disableSuggestionsStart) {
    flRuns.push({
      order: orderFl++,
      description: "Sugerencias en Inicio — desactivar",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SubscribedContent-338388Enabled /t REG_DWORD /d 0 /f',
    });
  }
  if (config.adjustVisualEffectsPerformance) {
    flRuns.push({
      order: orderFl++,
      description: "Efectos visuales — rendimiento",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects" /v VisualFXSetting /t REG_DWORD /d 2 /f',
    });
  }

  if (config.flRemovePreinstalledAppx) {
    flRuns.push({
      order: orderFl++,
      description: "Eliminar apps preinstaladas",
      path: CMD_REMOVE_PREINSTALLED_APPX,
    });
  }
  if (config.flDisableSilentInstalledApps) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar apps sugeridas",
      path: 'reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\ContentDeliveryManager" /v SilentInstalledAppsEnabled /t REG_DWORD /d 0 /f',
    });
  }
  if (config.flDisableCopilot) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar Copilot",
      path: 'reg add "HKCU\\Software\\Policies\\Microsoft\\Windows\\WindowsCopilot" /v TurnOffWindowsCopilot /t REG_DWORD /d 1 /f',
    });
  }
  if (config.flDisableRecall) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar Recall",
      path: "dism /online /disable-feature /featurename:Recall",
    });
  }
  if (config.flDisableDiagTrack) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar telemetría",
      path: "sc config DiagTrack start= disabled",
    });
  }
  if (config.flDisableFax) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar fax",
      path: "sc config Fax start= disabled",
    });
  }
  if (config.flDisableXblGameSave) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar Xbox Services",
      path: "sc config XblGameSave start= disabled",
    });
  }
  if (config.flUninstallOneDrive) {
    flRuns.push({
      order: orderFl++,
      description: "Desinstalar OneDrive",
      path: "%SystemRoot%\\SysWOW64\\OneDriveSetup.exe /uninstall",
    });
  }
  if (config.flDisableEdgeStartupBoost) {
    flRuns.push({
      order: orderFl++,
      description: "Desactivar Edge Startup Boost",
      path: 'reg add "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge" /v StartupBoostEnabled /t REG_DWORD /d 0 /f',
    });
  }
  if (config.flRemoveMapsApp) {
    flRuns.push({
      order: orderFl++,
      description: "Quitar Microsoft Mapas (Appx)",
      path: CMD_REMOVE_MAPS,
    });
  }
  if (config.flRemovePhoneLinkApp) {
    flRuns.push({
      order: orderFl++,
      description: "Quitar Vínculo con el móvil / Phone Experience (Appx)",
      path: CMD_REMOVE_PHONE_LINK,
    });
  }
  if (config.flDisablePrintSpooler) {
    flRuns.push({
      order: orderFl++,
      description: "Detener y deshabilitar cola de impresión (Spooler)",
      path: CMD_DISABLE_PRINT_SPOOLER,
    });
  }
  if (config.reduceAccessibilityShortcutPrompts) {
    flRuns.push({
      order: orderFl++,
      description:
        "Menos ventanas de accesibilidad (Teclas adhesivas / alternativas)",
      path: CMD_REDUCE_A11Y_POPUPS,
    });
  }

  const passwordXml = config.localPassword
    ? `
            <Password>
              <Value>${encodeUnattendPassword(config.localPassword)}</Value>
              <PlainText>false</PlainText>
            </Password>`
    : `
            <Password>
              <Value>${encodeUnattendPassword("")}</Value>
              <PlainText>true</PlainText>
            </Password>`;

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<unattend xmlns="urn:schemas-microsoft-com:unattend" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State">
  <settings pass="windowsPE">
    <component name="Microsoft-Windows-International-Core-WinPE" processorArchitecture="amd64" publicKeyToken="${PK}" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State">
      <SetupUILanguage>
        <UILanguage>${xmlEscape(config.uiLanguage)}</UILanguage>
      </SetupUILanguage>
      <InputLocale>${xmlEscape(config.inputLocalePe)}</InputLocale>
      <SystemLocale>${xmlEscape(config.systemLocale)}</SystemLocale>
      <UILanguage>${xmlEscape(config.uiLanguage)}</UILanguage>
      <UserLocale>${xmlEscape(config.userLocale)}</UserLocale>
    </component>
  </settings>
  ${deploymentComponent("windowsPE", peRuns)}
  <settings pass="specialize">
    <component name="Microsoft-Windows-Shell-Setup" processorArchitecture="amd64" publicKeyToken="${PK}" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State">
      <ComputerName>${xmlEscape(config.computerName)}</ComputerName>
    </component>
  </settings>
  ${deploymentComponent("specialize", specRuns)}
  <settings pass="oobeSystem">
    <component name="Microsoft-Windows-Shell-Setup" processorArchitecture="amd64" publicKeyToken="${PK}" language="neutral" versionScope="nonSxS" xmlns:wcm="http://schemas.microsoft.com/WMIConfig/2002/State">
      <TimeZone>${xmlEscape(config.timeZoneId)}</TimeZone>
      <UserAccounts>
        <LocalAccounts>
          <LocalAccount wcm:action="add">
            <Name>${xmlEscape(config.localAccountName)}</Name>
            <Group>Administrators</Group>
            ${passwordXml}
          </LocalAccount>
        </LocalAccounts>
      </UserAccounts>
      <OOBE>
        <HideEULAPage>${config.hideEULA}</HideEULAPage>
        <HideOEMRegistrationScreen>true</HideOEMRegistrationScreen>
        <HideOnlineAccountScreens>${config.hideOnlineAccountScreens}</HideOnlineAccountScreens>
        <HideWirelessSetupInOOBE>false</HideWirelessSetupInOOBE>
        <NetworkLocation>${config.networkLocationHome ? "Home" : "Work"}</NetworkLocation>
        <ProtectYourPC>3</ProtectYourPC>
      </OOBE>
      ${firstLogonCommands(flRuns)}
    </component>
  </settings>
</unattend>
`;

  return { xml, warnings };
}
