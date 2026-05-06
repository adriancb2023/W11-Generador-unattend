import { useMemo, useState } from "react";
import { OPTION_HELP } from "@/data/optionHelp";
import {
  PROFILE_DEFINITIONS,
  type ProfileId,
  applyProfile,
} from "@/data/profiles";
import { LANGUAGE_CHOICES, TIMEZONE_CHOICES } from "@/data/timezones";
import { useTheme } from "@/hooks/useTheme";
import { buildAutounattend } from "@/lib/buildAutounattend";
import type { GeneratorConfig, WindowsUpdatePolicyMode } from "@/types/config";
import { defaultConfig } from "@/types/config";

type BoolKey = {
  [K in keyof GeneratorConfig]: GeneratorConfig[K] extends boolean
    ? K
    : never;
}[keyof GeneratorConfig];

function SwitchWithHelp({
  k,
  checked,
  onChange,
}: {
  k: keyof typeof OPTION_HELP;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const meta = OPTION_HELP[k];
  return (
    <label className="switch-row">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="switch-body">
        <span className="switch-title">{meta.title}</span>
        <p className="switch-desc">{meta.help}</p>
        <details className="help">
          <summary>Ver ejemplo</summary>
          <p className="example">{meta.example}</p>
        </details>
      </span>
    </label>
  );
}

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: "application/xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function App() {
  const { mode, setMode } = useTheme();
  const [activeProfile, setActiveProfile] = useState<ProfileId | null>(null);

  const [cfg, setCfg] = useState<GeneratorConfig>({ ...defaultConfig });

  const { xml, warnings } = useMemo(() => buildAutounattend(cfg), [cfg]);

  const toggleTheme = () => {
    setMode(mode === "light" ? "dark" : mode === "dark" ? "system" : "light");
  };

  const setBool =
    (key: BoolKey) => (checked: boolean) =>
      setCfg((p) => ({ ...p, [key]: checked }));

  const applyProfilePreset = (id: ProfileId | null) => {
    setActiveProfile(id);
    setCfg((prev) => {
      const merged = applyProfile(id, defaultConfig);
      return {
        ...merged,
        computerName: prev.computerName,
        localAccountName: prev.localAccountName,
        localPassword: prev.localPassword,
        uiLanguage: prev.uiLanguage,
        inputLocalePe: prev.inputLocalePe,
        systemLocale: prev.systemLocale,
        userLocale: prev.userLocale,
        timeZoneId: prev.timeZoneId,
      };
    });
  };

  const onLanguagePreset = (id: string) => {
    const found = LANGUAGE_CHOICES.find((l) => l.id === id);
    if (!found) return;
    setCfg((p) => ({
      ...p,
      uiLanguage: found.id,
      systemLocale: found.id === "es-419" ? "es-MX" : found.id,
      userLocale: found.id === "es-419" ? "es-MX" : found.id,
      inputLocalePe: found.keyboardPe,
    }));
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <h1>Generador de autounattend.xml para Windows 10/11</h1>
          <p className="lead">
            Versión guiada en español: ayudas rápidas, ejemplos y perfiles para
            quien viene de cero. Genera archivos pensados para instalaciones{" "}
            <strong>limpias desde medios externos</strong> (USB/ISO).
          </p>
          <p className="lead" style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Este sitio <strong>no instala ni distribuye software</strong>: sólo genera
            XML para Windows Setup. Las opciones anti‑«bloat» limitan experiencias
            promocionadas o quitan Appx si siguen existiendo en tu iso; en builds
            recientes a menudo ya casi no hay nada que desinstalar con Remove‑Appx.
          </p>
          <p className="lead" style={{ marginTop: "0.5rem", fontSize: "0.95rem" }}>
            Inspiración conceptual similar a{" "}
            <a
              href="https://schneegans.de/windows/unattend-generator/"
              target="_blank"
              rel="noreferrer"
            >
              el generador de Schneegans
            </a>
            ; aquí tienes menos opciones pero con explicaciones en castellano. El
            XML resultante debe probarse en una máquina virtual antes de usarlo en un
            equipo real.
          </p>
        </div>
        <div className="toolbar">
          <button type="button" className="btn btn-ghost" onClick={toggleTheme}>
            Tema: {mode === "system" ? "Sistema" : mode === "dark" ? "Oscuro" : "Claro"}
          </button>
        </div>
      </header>

      <section className="panel">
        <h2>Perfiles rápidos</h2>
        <p className="hint">
          Al elegir uno se <strong>restablecen toggles guiados</strong> a ese estilo,
          manteniendo tu idioma/zona/usuario/clave escritos más abajo. “Mínimo” deja
          los valores base de esta web.
        </p>
        <div className="toolbar">
          <button
            type="button"
            className={`btn ${activeProfile === null ? "btn-primary" : ""}`}
            onClick={() => applyProfilePreset(null)}
          >
            Solo mis ajustes
          </button>
          {PROFILE_DEFINITIONS.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`btn ${activeProfile === p.id ? "btn-primary" : ""}`}
              title={p.summary}
              onClick={() => applyProfilePreset(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>
        {activeProfile && (
          <p className="hint" style={{ marginTop: "0.75rem" }}>
            {PROFILE_DEFINITIONS.find((x) => x.id === activeProfile)?.summary}
          </p>
        )}
      </section>

      <section className="panel">
        <h2>Idioma, teclado y hora</h2>
        <p className="hint">
          El desplegable fija un trío coherente (idioma + teclado PE). Ajusta el detalle
          si tu ISO trae otro paquete.
        </p>
        <div className="grid-2">
          <label className="field">
            Plantilla rápida
            <select
              value={
                LANGUAGE_CHOICES.some((x) => x.id === cfg.uiLanguage)
                  ? cfg.uiLanguage
                  : "__custom__"
              }
              onChange={(e) => {
                const v = e.target.value;
                if (v === "__custom__") return;
                onLanguagePreset(v);
              }}
            >
              {LANGUAGE_CHOICES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
              <option value="__custom__">Personalizado (usa los campos de texto)</option>
            </select>
            <span>Teclado PE asociado: {cfg.inputLocalePe}</span>
          </label>
          <label className="field">
            <span>{OPTION_HELP.uiLanguage.title}</span>
            <input
              type="text"
              value={cfg.uiLanguage}
              onChange={(e) => setCfg((p) => ({ ...p, uiLanguage: e.target.value }))}
            />
          </label>
          <label className="field">
            <span>{OPTION_HELP.inputLocalePe.title}</span>
            <input
              type="text"
              value={cfg.inputLocalePe}
              onChange={(e) =>
                setCfg((p) => ({ ...p, inputLocalePe: e.target.value }))
              }
            />
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">{OPTION_HELP.inputLocalePe.example}</p>
            </details>
          </label>
          <label className="field">
            <span>{OPTION_HELP.systemLocale.title}</span>
            <input
              type="text"
              value={cfg.systemLocale}
              onChange={(e) =>
                setCfg((p) => ({ ...p, systemLocale: e.target.value }))
              }
            />
          </label>
          <label className="field">
            <span>{OPTION_HELP.userLocale.title}</span>
            <input
              type="text"
              value={cfg.userLocale}
              onChange={(e) => setCfg((p) => ({ ...p, userLocale: e.target.value }))}
            />
          </label>
          <label className="field">
            Plantillas de zona horaria
            <select
              aria-label="Aplicar plantilla de zona horaria"
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v)
                  setCfg((p) => ({
                    ...p,
                    timeZoneId: v,
                  }));
              }}
            >
              <option value="">— aplicar una plantilla al campo siguiente —</option>
              {TIMEZONE_CHOICES.map((tz) => (
                <option key={tz.id} value={tz.id}>
                  {tz.label} — {tz.id}
                </option>
              ))}
            </select>
            <span>{OPTION_HELP.timeZoneId.title}</span>
            <input
              type="text"
              value={cfg.timeZoneId}
              onChange={(e) =>
                setCfg((p) => ({ ...p, timeZoneId: e.target.value }))
              }
            />
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">{OPTION_HELP.timeZoneId.example}</p>
            </details>
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Equipo y cuentas</h2>
        <div className="grid-2">
          <label className="field">
            <span>{OPTION_HELP.computerName.title}</span>
            <input
              type="text"
              maxLength={15}
              value={cfg.computerName}
              onChange={(e) =>
                setCfg((p) => ({ ...p, computerName: e.target.value }))
              }
            />
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">{OPTION_HELP.computerName.example}</p>
            </details>
          </label>
          <label className="field">
            <span>{OPTION_HELP.localAccountName.title}</span>
            <input
              type="text"
              value={cfg.localAccountName}
              onChange={(e) =>
                setCfg((p) => ({ ...p, localAccountName: e.target.value }))
              }
            />
          </label>
          <label className="field" style={{ gridColumn: "1 / -1" }}>
            <span>{OPTION_HELP.localPassword.title}</span>
            <input
              type="password"
              autoComplete="new-password"
              value={cfg.localPassword}
              onChange={(e) =>
                setCfg((p) => ({ ...p, localPassword: e.target.value }))
              }
            />
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">{OPTION_HELP.localPassword.example}</p>
            </details>
          </label>
        </div>
      </section>

      <section className="panel">
        <h2>Asistente (OOBE) y red</h2>
        <SwitchWithHelp
          k="hideEULA"
          checked={cfg.hideEULA}
          onChange={setBool("hideEULA")}
        />
        <SwitchWithHelp
          k="hideOnlineAccountScreens"
          checked={cfg.hideOnlineAccountScreens}
          onChange={setBool("hideOnlineAccountScreens")}
        />
        <SwitchWithHelp
          k="networkLocationHome"
          checked={cfg.networkLocationHome}
          onChange={setBool("networkLocationHome")}
        />
        <SwitchWithHelp
          k="allowOfflineLocalAccountHint"
          checked={cfg.allowOfflineLocalAccountHint}
          onChange={setBool("allowOfflineLocalAccountHint")}
        />
        <p className="hint">
          <strong>Un solo usuario:</strong> este generador define una cuenta local
          administrador en el XML; no añade más entradas en{" "}
          <code>LocalAccounts</code>. Para típico «solo yo uso este PC», mantén oculto
          el flujo Microsoft online y no crees más usuarios después del primer arranque
          si no los necesitas.
        </p>
      </section>

      <section className="panel">
        <h2>Compatibilidad Win11</h2>
        <SwitchWithHelp
          k="bypassWin11Checks"
          checked={cfg.bypassWin11Checks}
          onChange={setBool("bypassWin11Checks")}
        />
      </section>

      <section className="panel">
        <h2>Rendimiento de disco y sistema</h2>
        <SwitchWithHelp
          k="enableLongPaths"
          checked={cfg.enableLongPaths}
          onChange={setBool("enableLongPaths")}
        />
        <SwitchWithHelp
          k="disableLastAccessTimestamp"
          checked={cfg.disableLastAccessTimestamp}
          onChange={setBool("disableLastAccessTimestamp")}
        />
        <SwitchWithHelp
          k="disableFastStartup"
          checked={cfg.disableFastStartup}
          onChange={setBool("disableFastStartup")}
        />
        <SwitchWithHelp
          k="adjustVisualEffectsPerformance"
          checked={cfg.adjustVisualEffectsPerformance}
          onChange={setBool("adjustVisualEffectsPerformance")}
        />
      </section>

      <section className="panel">
        <h2>Privacidad / experiencias conectadas</h2>
        <SwitchWithHelp
          k="minimizeTelemetry"
          checked={cfg.minimizeTelemetry}
          onChange={setBool("minimizeTelemetry")}
        />
        <SwitchWithHelp
          k="disableConsumerFeatures"
          checked={cfg.disableConsumerFeatures}
          onChange={setBool("disableConsumerFeatures")}
        />
        <SwitchWithHelp
          k="privacyDisableAdvertisingIdPolicy"
          checked={cfg.privacyDisableAdvertisingIdPolicy}
          onChange={setBool("privacyDisableAdvertisingIdPolicy")}
        />
        <SwitchWithHelp
          k="privacyDisablePublishUserActivities"
          checked={cfg.privacyDisablePublishUserActivities}
          onChange={setBool("privacyDisablePublishUserActivities")}
        />
        <SwitchWithHelp
          k="privacyDisableTailoredExperiencesWithDiagnosticData"
          checked={cfg.privacyDisableTailoredExperiencesWithDiagnosticData}
          onChange={setBool(
            "privacyDisableTailoredExperiencesWithDiagnosticData",
          )}
        />

        <label className="field" style={{ marginTop: "0.75rem" }}>
          <span>{OPTION_HELP.windowsUpdateModePolicy.title}</span>
          <select
            value={cfg.windowsUpdateMode}
            onChange={(e) =>
              setCfg((p) => ({
                ...p,
                windowsUpdateMode: e.target.value as WindowsUpdatePolicyMode,
              }))
            }
          >
            <option value="default">
              Automático — sin política AU extra en este XML
            </option>
            <option value="notify">
              Notificar antes de descargar e instalar (AUOptions 2)
            </option>
            <option value="manual">
              Manual — sin actualización automática (NoAutoUpdate)
            </option>
          </select>
          <span>
            {OPTION_HELP.windowsUpdateModePolicy.help}{" "}
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">
                {OPTION_HELP.windowsUpdateModePolicy.example}
              </p>
            </details>
          </span>
        </label>
      </section>

      <section className="panel">
        <h2>Explorer y barra de tareas</h2>
        <SwitchWithHelp
          k="explorerShowExtensions"
          checked={cfg.explorerShowExtensions}
          onChange={setBool("explorerShowExtensions")}
        />
        <SwitchWithHelp
          k="explorerOpenToThisPc"
          checked={cfg.explorerOpenToThisPc}
          onChange={setBool("explorerOpenToThisPc")}
        />
        <SwitchWithHelp
          k="taskbarLeftAlignWin11"
          checked={cfg.taskbarLeftAlignWin11}
          onChange={setBool("taskbarLeftAlignWin11")}
        />
        <SwitchWithHelp
          k="hideWidgetsTaskbar"
          checked={cfg.hideWidgetsTaskbar}
          onChange={setBool("hideWidgetsTaskbar")}
        />
      </section>

      <section className="panel">
        <h2>Apariencia y PC muy ligero</h2>
        <p className="hint">
          Modo oscuro y transparencias se aplican a la{" "}
          <strong>plantilla Default</strong> (specialize) y al{" "}
          <strong>primer usuario</strong> que entra (FirstLogon). Mapas / móvil se
          quitan con PowerShell; la cola de impresión es la opción más agresiva del
          grupo.
        </p>
        <SwitchWithHelp
          k="darkModeAppsAndSystem"
          checked={cfg.darkModeAppsAndSystem}
          onChange={setBool("darkModeAppsAndSystem")}
        />
        <SwitchWithHelp
          k="disableTransparencyEffects"
          checked={cfg.disableTransparencyEffects}
          onChange={setBool("disableTransparencyEffects")}
        />
        <SwitchWithHelp
          k="flRemoveMapsApp"
          checked={cfg.flRemoveMapsApp}
          onChange={setBool("flRemoveMapsApp")}
        />
        <SwitchWithHelp
          k="flRemovePhoneLinkApp"
          checked={cfg.flRemovePhoneLinkApp}
          onChange={setBool("flRemovePhoneLinkApp")}
        />
        <SwitchWithHelp
          k="flDisablePrintSpooler"
          checked={cfg.flDisablePrintSpooler}
          onChange={setBool("flDisablePrintSpooler")}
        />
        <SwitchWithHelp
          k="reduceAccessibilityShortcutPrompts"
          checked={cfg.reduceAccessibilityShortcutPrompts}
          onChange={setBool("reduceAccessibilityShortcutPrompts")}
        />
      </section>

      <section className="panel">
        <h2>Gaming</h2>
        <p className="hint">
          La opción de <strong>precisión del puntero</strong> también se vuelca en el perfil{" "}
          <strong>Default</strong> (specialize), así las cuentas que se creen después tienden a heredar lo mismo.
        </p>
        <SwitchWithHelp
          k="disableEnhancePointerPrecision"
          checked={cfg.disableEnhancePointerPrecision}
          onChange={setBool("disableEnhancePointerPrecision")}
        />
        <SwitchWithHelp
          k="disableGameBarTips"
          checked={cfg.disableGameBarTips}
          onChange={setBool("disableGameBarTips")}
        />
        <SwitchWithHelp
          k="disableSuggestionsStart"
          checked={cfg.disableSuggestionsStart}
          onChange={setBool("disableSuggestionsStart")}
        />
      </section>

      <section className="panel">
        <h2>Primer inicio: limpieza equilibrada (opcional)</h2>
        <p className="hint">
          Estos comandos se añaden al <strong>final</strong> de{" "}
          <code>FirstLogonCommands</code> (el número de <code>Order</code> se
          calcula solo). Pensado para gaming / dev / uso diario sin tocar
          Windows Update, Defender, WMI, SysMain ni indexación. No quites Store
          ni Edge por completo ni uses scripts tipo AtlasOS/ReviOS si quieres un
          sistema “sano” a largo plazo.
        </p>
        <p className="hint">
          Si tu Windows ya viene muy limpio,{" "}
          <strong>Remove‑Appx puede no hacer nada</strong> (salida vacía): es
          normal. Lo que más ayuda a que «no se instalen» sugerencias es la sección
          de privacidad (<strong>experiencias dirigidas</strong>), que también rellena
          la plantilla del usuario Default en la fase specialize.
        </p>
        <SwitchWithHelp
          k="flRemovePreinstalledAppx"
          checked={cfg.flRemovePreinstalledAppx}
          onChange={setBool("flRemovePreinstalledAppx")}
        />
        <SwitchWithHelp
          k="flDisableSilentInstalledApps"
          checked={cfg.flDisableSilentInstalledApps}
          onChange={setBool("flDisableSilentInstalledApps")}
        />
        <SwitchWithHelp
          k="flDisableCopilot"
          checked={cfg.flDisableCopilot}
          onChange={setBool("flDisableCopilot")}
        />
        <SwitchWithHelp
          k="flDisableRecall"
          checked={cfg.flDisableRecall}
          onChange={setBool("flDisableRecall")}
        />
        <SwitchWithHelp
          k="flDisableDiagTrack"
          checked={cfg.flDisableDiagTrack}
          onChange={setBool("flDisableDiagTrack")}
        />
        <SwitchWithHelp
          k="flDisableFax"
          checked={cfg.flDisableFax}
          onChange={setBool("flDisableFax")}
        />
        <SwitchWithHelp
          k="flDisableXblGameSave"
          checked={cfg.flDisableXblGameSave}
          onChange={setBool("flDisableXblGameSave")}
        />
        <SwitchWithHelp
          k="flUninstallOneDrive"
          checked={cfg.flUninstallOneDrive}
          onChange={setBool("flUninstallOneDrive")}
        />
        <SwitchWithHelp
          k="flDisableEdgeStartupBoost"
          checked={cfg.flDisableEdgeStartupBoost}
          onChange={setBool("flDisableEdgeStartupBoost")}
        />
      </section>

      <section className="panel">
        <h2>Microsoft Defender</h2>
        <p className="hint">
          No es posible bajar el «consumo» global de Defender a un 25 % fijo desde unattend:
          lo que existe es{" "}
          <strong>AvgCPULoadFactor</strong> — techo aproximado de CPU **durante análisis**.
        </p>
        <label className="field">
          <span>{OPTION_HELP.defenderAvgCpuLoadFactorDuringScan.title}</span>
          <div className="toolbar" style={{ marginBottom: "0.35rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setCfg((p) => ({ ...p, defenderAvgCpuLoadFactorDuringScan: 0 }))
              }
            >
              Sin directiva (0)
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setCfg((p) => ({ ...p, defenderAvgCpuLoadFactorDuringScan: 25 }))
              }
            >
              25 %
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() =>
                setCfg((p) => ({ ...p, defenderAvgCpuLoadFactorDuringScan: 50 }))
              }
            >
              50 %
            </button>
          </div>
          <input
            type="number"
            min={0}
            max={100}
            step={1}
            value={cfg.defenderAvgCpuLoadFactorDuringScan}
            onChange={(e) => {
              const raw = e.target.value;
              const n = parseInt(raw, 10);
              setCfg((p) => ({
                ...p,
                defenderAvgCpuLoadFactorDuringScan:
                  raw === "" || Number.isNaN(n) ? 0 : n,
              }));
            }}
          />
          <span>
            {OPTION_HELP.defenderAvgCpuLoadFactorDuringScan.help}{" "}
            <details className="help">
              <summary>Ver ejemplo</summary>
              <p className="example">
                {OPTION_HELP.defenderAvgCpuLoadFactorDuringScan.example}
              </p>
            </details>
          </span>
        </label>
      </section>

      <section className="panel">
        <h2>Seguridad (solo entornos controlados)</h2>
        <SwitchWithHelp
          k="disableSmartScreenWarn"
          checked={cfg.disableSmartScreenWarn}
          onChange={setBool("disableSmartScreenWarn")}
        />
      </section>

      {warnings.length > 0 && (
        <div className="warnings" role="status">
          <strong>Avisos</strong>
          <ul>
            {warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <section className="panel">
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            alignItems: "center",
          }}
        >
          <h2 style={{ flex: "1 1 auto", margin: 0 }}>
            Vista previa y descarga
          </h2>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => downloadText("autounattend.xml", xml)}
          >
            Descargar autounattend.xml
          </button>
        </div>
        <textarea className="preview" readOnly value={xml} spellCheck={false} />
      </section>

      <p className="footer-note">
        Copia el archivo en la raíz del USB de instalación (junto a setup.exe). Los
        ajustes de registro vía “FirstLogon” se aplican al usuario que entra la primera
        vez; valida en una VM. No sustituye licencias oficiales ni soporte de Microsoft.
      </p>
    </div>
  );
}
