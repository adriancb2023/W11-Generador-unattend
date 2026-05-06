/** Texto de ayuda y ejemplo por clave de configuración (es-ES). */
export const OPTION_HELP: Record<
  string,
  { title: string; help: string; example: string }
> = {
  uiLanguage: {
    title: "Idioma de interfaz durante la instalación (PE)",
    help: "Determina el idioma de Setup y debe coincidir con el contenido disponible en tu ISO. Si instalas desde un medio en español, usa es-ES o es-MX según tu imagen.",
    example: 'ISO en español de España → "es-ES". ISO LATAM oficial → suele funcionar mejor "es-MX".',
  },
  inputLocalePe: {
    title: "Disposición de teclado (PE)",
    help: 'Par "identificador de idioma hexadecimal : identificador de teclado" que usará WinPE antes de cargar tu sistema final.',
    example: 'España: "040a:0000040a". Estados Unidos (QWERTY US): "0409:00000409".',
  },
  systemLocale: {
    title: "Configuración regional del sistema",
    help: 'Formateo numérico, moneda y detalles de región tras la instalación. Convive con el idioma de visualización.',
    example:
      'Si quieres fechas día/mes en estilo local y Windows en español: "es-ES".',
  },
  userLocale: {
    title: "Región del usuario predeterminada",
    help: "En instalaciones desatendidas suele alinearse con systemLocale para evitar mezclas raras la primera vez.",
    example: 'Normalmente el mismo valor que systemLocale, p. ej. "es-ES".',
  },
  timeZoneId: {
    title: "Zona horaria (TimeZone ID de Windows)",
    help: "Nombre interno de la zona (no el desplazamiento UTC). Se aplica al finalizar OOBE.",
    example:
      'Península y Baleares: "Romance Standard Time". Canarias: "GMT Standard Time". México centro: "Central Standard Time".',
  },
  computerName: {
    title: "Nombre del equipo (NetBIOS)",
    help: "Máximo 15 caracteres alfanuméricos o guion. Evita espacios y caracteres raros.",
    example: 'Válido: "OFICINA-01". No válido: "Mi PC bonito!!" (espacios y longitud).',
  },
  localAccountName: {
    title: "Usuario local administrador",
    help: "Se crea una cuenta local en el grupo Administradores. No es una cuenta Microsoft.",
    example: 'Algo corto y sin acentos suele evitar problemas con scripts viejos: "Harvie".',
  },
  localPassword: {
    title: "Contraseña de la cuenta local",
    help: "En el XML se guarda codificada (Base64 de UTF-16LE), no en texto plano. Aun así, trata el archivo como sensible.",
    example: "Usa una contraseña fuerte; guárdala en un gestor y no subas el XML a sitios públicos.",
  },
  hideOnlineAccountScreens: {
    title: "Ocultar pantallas de cuenta Microsoft en OOBE",
    help: "Empuja el flujo hacia cuenta local. Este XML crea una sola cuenta local administrador en UserAccounts; combinado con esto suele bastar para el escenario “un solo usuario” sin entrar en dominios.",
    example:
      "PC personal con un único login local; si necesitas cuenta Microsoft más tarde, la puedes vincular desde Configuración.",
  },
  hideEULA: {
    title: "Ocultar la página del contrato (EULA)",
    help: "Marca la aceptación automáticamente en flujos desatendidos. Legalmente debes tener derecho a usar la licencia que instalas.",
    example: "Activo en laboratorios y despliegues internos con licenciamiento claro.",
  },
  networkLocationHome: {
    title: "Perfil de red: Hogar",
    help: "Work vs Home antiguamente influía en el grupo hogar y descubrimiento. Hoy es sobre todo un matiz de asistente; Work es habitual en oficina.",
    example: "PC doméstico aislado → puedes marcar Hogar. Dominio/empresa → desmarcado (Work).",
  },
  bypassWin11Checks: {
    title: "Intentar saltar comprobaciones de Windows 11 (TPM, etc.)",
    help: "Crea claves LabConfig en fase temprana. No sustituye drivers ni arregla hardware incompatible; úsalo con precaución.",
    example: "VM antigua sin TPM de pruebas: a veces encaja. Hardware real sin soporte: arriesgas actualizaciones rotas.",
  },
  allowOfflineLocalAccountHint: {
    title: "Recordatorio: cuenta local “sin internet”",
    help: "Esta app no cambia el comportamiento por sí sola: es un aviso. En versiones recientes de Windows 11 el asistente online cambia; combina con ISO Pro o políticas según tu caso.",
    example:
      "Si ves bloqueo online, consulta la guía de tu edición o prepara respuestas adicionales (no cubiertas aquí en detalle).",
  },
  enableLongPaths: {
    title: "Habilitar rutas largas en NTFS",
    help: "Permite a muchas APIs usar rutas >260 caracteres sin prefijo \\\\?\\. Requiere reinicio en algunos casos.",
    example: "Repositorios Node profundos o backups con nombres largos dejan de fallar tan a menudo.",
  },
  disableLastAccessTimestamp: {
    title: "No actualizar marca de último acceso en archivos",
    help: "fsutil reduce escrituras extra en discos con muchísimos ficheros pequeños. Efecto modesto en equipos de escritorio normales.",
    example: "Servidor de millones de archivos: útil. PC gaming casual: ganancia pequeña.",
  },
  disableFastStartup: {
    title: "Desactivar inicio rápido (hibernar kernel)",
    help: "Evita que Windows guarde el kernel al apagar; arranques “en frío” más limpios a cambio de unos segundos más.",
    example: "Si dual-boot o particiones que otro SO monta, ayuda a evitar estados raros.",
  },
  minimizeTelemetry: {
    title: "Política AllowTelemetry = 0 (cuando aplica)",
    help: "En ediciones que respetan la directiva, básicamente envía menos diagnósticos. En Home puede ignorarse en parte.",
    example: "Empresa con Windows Enterprise/Education: suele ser coherente. Home: revisa qué hace realmente tu build.",
  },
  disableConsumerFeatures: {
    title: "Desactivar experiencias dirigidas (CloudContent + plantilla Default)",
    help: "HKLM\\Policies\\CloudContent\\DisableWindowsConsumerFeatures y, en specialize, se carga NTUSER.DAT del usuario Default y se escriben claves en ContentDeliveryManager (SilentInstalledAppsEnabled, PreInstalledAppsEnabled, SoftLandingEnabled) para perfiles nuevos. En Windows 11 reciente suele haber poca precarga: Remove-Appx puede no eliminar nada; esto refuerza que no «crezca» basura tras actualizaciones.",
    example:
      "Si casi no ves apps extra al instalar, el bloque PowerShell puede ser una no‑op; las políticas + Default siguen siendo el núcleo anti‑sugerencias.",
  },
  privacyDisableAdvertisingIdPolicy: {
    title: "Desactivar ID de publicidad (directiva)",
    help: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\AdvertisingInfo\\DisabledByGroupPolicy = 1. Reduce uso del identificador publicitario entre apps que lo consultan.",
    example: "Complemento a telemetría mínima y experiencias dirigidas desactivadas.",
  },
  privacyDisablePublishUserActivities: {
    title: "Línea de tiempo: no publicar ni subir actividades",
    help: "HKLM\\…\\System: PublishUserActivities y UploadUserActivities en 0. Limita sincronización/historial de lo que abres entre dispositivos.",
    example: "Equipos donde no quieres «huella» de apps recientes en la nube.",
  },
  privacyDisableTailoredExperiencesWithDiagnosticData: {
    title: "Sin experiencias personalizadas con datos de diagnóstico",
    help: "HKLM\\…\\CloudContent\\DisableTailoredExperiencesWithDiagnosticData = 1. Va en la línea de reducir sugerencias basadas en telemetría.",
    example: "Junto a AllowTelemetry bajo y Consumer Features off.",
  },
  windowsUpdateModePolicy: {
    title: "Windows Update: automático, sólo avisos o manual",
    help: "Políticas en HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\WindowsUpdate\\AU. «Notificar» (AUOptions=2) pide confirmación antes de descargar e instalar. «Manual» (NoAutoUpdate=1) desactiva la actualización automática: debes abrir Configuración → Windows Update y buscar actualizaciones tú mismo; **riesgo de seguridad** si lo olvidas.",
    example:
      "Laboratorio o PC que preparas antes de conectar a red: manual. Uso diario en Internet: mejor «por defecto» o «notificar».",
  },
  hideWidgetsTaskbar: {
    title: "Ocultar botón de widgets (Windows 11)",
    help: "Toca el registro del perfil que inicia sesión la primera vez; versiones futuras pueden mover la clave.",
    example: "Escritorio minimalista sin noticias en la barra.",
  },
  explorerShowExtensions: {
    title: "Mostrar extensiones de archivo",
    help: "Evita que archivo.exe se vea como archivo amable; mejora seguridad y claridad.",
    example: "Ver .pdf frente a .pdf.exe en descargas dudosas.",
  },
  explorerOpenToThisPc: {
    title: "Explorador abre en Este equipo",
    help: "Evita aterrizar en Acceso rápido con OneDrive y sugerencias si prefieres un árbol clásico.",
    example: "Flujo técnico: ir directo a discos y unidades de red.",
  },
  taskbarLeftAlignWin11: {
    title: "Alinear barra a la izquierda (Windows 11)",
    help: "Restaura sensación clásica tipo Windows 10 en monitores anchos.",
    example: "Ultrawide con muchas ventanas: iconos arrancan desde el borde.",
  },
  disableEnhancePointerPrecision: {
    title: "Desactivar “Precisión del puntero mejorada” (recomendado)",
    help: "Quita la aceleración del ratón (MouseSpeed / umbrales a cero). Se escribe en la plantilla **Default** durante specialize para que **casi todas las cuentas nuevas** arranquen igual, y en FirstLogon para el primer usuario administrador por si el copiado del perfil se aplicara antes. En escritorio puramente ofimático algunos prefieren la aceleración clásica: entonces desmárcalo.",
    example:
      "Gaming / streaming / trabajo con sensibilidad fija: suele ser más cómodo y predecible. Para uso táctil o ratón muy lento en sobremesa antigua, valora dejarlo en «Mejorar precisión».",
  },
  disableGameBarTips: {
    title: "Reducir capturas / Game DVR integrado",
    help: "Desactiva piezas del Game Bar que graban o superponen; no sustituye a drivers GPU.",
    example: "eSports en PC débil: menos servicios en segundo plano.",
  },
  disableSuggestionsStart: {
    title: "Menos sugerencias patrocinadas en el menú Inicio",
    help: "Una clave de ContentDeliveryManager; Microsoft añade otras con el tiempo.",
    example: "Menos azulejos/apps sugeridas tras instalar.",
  },
  adjustVisualEffectsPerformance: {
    title: "Efectos visuales orientados a rendimiento",
    help: "Fija VisualFXSetting a un perfil rápido; se nota más en GPUs integradas viejas.",
    example: "Portátil con iGPU: animaciones menos pesadas.",
  },
  disableSmartScreenWarn: {
    title: "Desactivar SmartScreen (directiva)",
    help: "Menos avisos al abrir ejecutables desconocidos, más riesgo de malware. Solo entornos controlados.",
    example: "Máquina aislada de pruebas con imágenes firmadas internamente.",
  },

  defenderAvgCpuLoadFactorDuringScan: {
    title: "Límite de CPU de Defender durante análisis (AvgCPULoadFactor)",
    help: "Directiva en HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows Defender\\Scan. Microsoft documenta que limita el uso **medio de CPU mientras corre un análisis antivirus**, no el «consumo total» del equipo ni la RAM. El valor por defecto típico del producto es ~50 %. **No** sustituye desactivar Defender; si combinas otras directivas (p. ej. análisis sólo en reposo sin limitar CPU), Windows puede ignorar este valor.",
    example:
      "25 = análisis más suaves en juegos o renders; los barridos completos pueden alargarse. 0 en el formulario = no escribir esta política.",
  },

  flRemovePreinstalledAppx: {
    title: "Eliminar apps preinstaladas (Appx en sesión actual)",
    help: 'PowerShell Quita paquetes coincidentes por nombre (Xbox, Bing, Clipchamp, etc.). No toca Microsoft Store ni usa Remove-AppxProvisionedPackage masivo: eso evita muchos fallos raros.\n\nLos comandos se encadenan después del resto de FirstLogonCommands; el <Order> es automático.',
    example:
      'Si más adelante te falta alguna app ligera, puedes reinstalarla desde Store cuando haga falta. No es un “desnudar Windows” al estilo AtlasOS.',
  },
  flDisableSilentInstalledApps: {
    title: "SilentInstalledAppsEnabled = 0",
    help: "Reduce la reinstalación silenciosa de apps promocionadas vía ContentDeliveryManager.",
    example: "Menos sorpresas en Inicio tras grandes actualizaciones.",
  },
  flDisableCopilot: {
    title: "Política Copilot (TurnOffWindowsCopilot)",
    help: "Escritura en HKCU\\…\\WindowsCopilot como en tu receta. El botón o funciones pueden variar según build.",
    example: "Escritorio sin asistente lateral si la build lo respeta.",
  },
  flDisableRecall: {
    title: "DISM: deshabilitar Recall",
    help: "Comando en línea contra la imagen en ejecución durante el primer inicio (administrador). Si la feature no existe en tu ISO, DISM puede fallar sin afectar al resto.",
    example: 'Recomendable en builds con Recall; revisa el log si ves error "no se encontró".',
  },
  flDisableDiagTrack: {
    title: "Servicio DiagTrack (telemetría) en manual/deshabilitado",
    help: "Usa sc config. Distinto de la directiva AllowTelemetry; no toca Windows Update ni Defender.",
    example: "Algo menos de telemetría a nivel servicio; combinado con tus otras opciones de privacidad.",
  },
  flDisableFax: {
    title: "Servicio Fax deshabilitado",
    help: "Casi nadie usa fax en PCs domésticos; sc config Fax start= disabled (el espacio tras = es importante).",
    example: "Sin sorpresas: servicio inútil apagado.",
  },
  flDisableXblGameSave: {
    title: "XblGameSave deshabilitado",
    help: "Servicio relacionado con Xbox Live save; no equivale a borrar la app Xbox entera (eso va en el bloque Appx). Útil si no usas juegos con logros en la nube.",
    example: "Un corte fino sin tumbar todo el ecosistema Xbox manualmente.",
  },
  flUninstallOneDrive: {
    title: "OneDriveSetup.exe /uninstall (SysWOW64)",
    help: "Llama al desinstalador clásico desde %SystemRoot%\\SysWOW64. En algunos SKUs o ARM el camino puede diferir; esta plantilla apunta a amd64 típico.",
    example: "Equipos que sincronizan con otra nube o prefieren no tener cliente OneDrive.",
  },
  flDisableEdgeStartupBoost: {
    title: "Directiva Edge StartupBoostEnabled = 0",
    help: "HKLM\\SOFTWARE\\Policies\\Microsoft\\Edge: evita que Edge se mantenga residente para arranque rápido. No desinstala Edge (recomendación: no hacerlo).",
    example: "Menos RAM en reposo sin tocar motor de actualizaciones.",
  },

  darkModeAppsAndSystem: {
    title: "Modo oscuro (aplicaciones + Windows)",
    help: "En specialize se escribe en la plantilla Default (NTUSER.DAT) y en el primer inicio en HKCU del usuario administrador: AppsUseLightTheme y SystemUsesLightTheme en 0.",
    example:
      "Escritorio oscuro coherente tras OOBE; puedes cambiarlo luego en Personalización.",
  },
  disableTransparencyEffects: {
    title: "Sin efectos de transparencia / acrílico",
    help: "EnableTransparency = 0 en Personalize; algo menos de trabajo para la GPU compuesta en PCs modestos.",
    example: "Portátiles con iGPU donde quieres máximo FPS en escritorio.",
  },
  flRemoveMapsApp: {
    title: "Quitar Microsoft Mapas",
    help: "Remove-AppxPackage sobre paquetes *WindowsMaps*. No quita el motor de ubicación entero; sólo la app UWP típica.",
    example: "Torre gaming sin GPS ni uso de mapas.",
  },
  flRemovePhoneLinkApp: {
    title: "Quitar «Vínculo con el móvil» / Phone Experience",
    help: "Elimina Appx coincidentes con YourPhone y PhoneExperience (nombres cambian entre builds). Reduce funciones «teléfono en el PC».",
    example: "No enlazar Android/iPhone con Windows desde esa app integrada.",
  },
  flDisablePrintSpooler: {
    title: "Desactivar servicio Cola de impresión",
    help: "Detiene Spooler y lo deja disabled. Ahorra un servicio de fondo pero **no podrás imprimir** (ni muchas virtual printers) hasta ejecutar sc config Spooler start= demand & net start Spooler.",
    example: "PC que jamás imprime; confirma antes en VM.",
  },
  reduceAccessibilityShortcutPrompts: {
    title: "Menos ventanas de Teclas adhesivas / filtros / alternativas",
    help: "Ajusta Flags en StickyKeys, ToggleKeys y Keyboard Response (Filter Keys) para evitar diálogos al pulsar Shift varias veces, etc. No desactiva Narrator ni Magnifier; **no sustituye** a una configuración accesible pensada.",
    example:
      "Jugadores que disparan Shift y odian el popup; mal si conviven personas que necesitan esos atajos.",
  },
};
