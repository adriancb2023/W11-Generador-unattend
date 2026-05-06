# Generador autounattend.xml — Windows 10/11 (ES)

[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**Crea archivos `autounattend.xml` en español** con ayuda contextual, ejemplos, perfiles (gaming, rendimiento, productividad, privacidad…) y vista previa lista para copiar o descargar. Pensado para **instalaciones limpias** desde USB/ISO.

## Demo en vivo

**[https://w11.kybernatech.com](https://w11.kybernatech.com)**

Si te resulta útil, deja una ⭐ en este repositorio y comparte el enlace: ayuda a que otros lo encuentren y mantiene el proyecto visible.

## ¿Por qué usarlo?

- **Interfaz en español** con explicaciones para quien no domina unattend.
- **Modo claro / oscuro** (tema persistido en el navegador).
- **Perfiles** que activan grupos de opciones de un clic (Mínimo, Gaming, Rendimiento, Ultra ligero, Privacidad fuerte, *Gaming + Rendimiento + Productividad*, etc.).
- **Privacidad y seguridad equilibradas**: telemetría, experiencias dirigidas, Defender (límite de CPU en análisis), SmartScreen opcional, Windows Update manual o solo notificaciones.
- **FirstLogon** opcional: quitar apps típicas, Copilot, Recall, OneDrive, Edge startup boost, etc., **sin** tocar servicios críticos que suelen romper dev (Update, Defender completo, WMI, SysMain, indexador).
- El XML usa pasos estándar de Windows Setup: **`specialize`** (`RunSynchronous` / políticas HKLM) y **`oobeSystem`** (`FirstLogonCommands`).

> Inspiración conceptual similar al [generador de Schneegans](https://schneegans.de/windows/unattend-generator/). Este proyecto es una SPA independiente con un subconjunto de opciones y enfoque didáctico.

## Requisitos

- Node.js **18+** (recomendado LTS)
- npm

## Uso en local

```bash
# Sustituye la URL por la de este repositorio en GitHub
git clone https://github.com/<org-o-usuario>/<nombre-repo>.git
cd <nombre-repo>
npm install
npm run dev
```

Abre la URL que indique Vite (por defecto `http://localhost:5173`).

## Build y carpeta para el servidor

```bash
npm run build          # salida en dist/
npm run pack:server    # dist/ copiado a para-servidor/ (listo para subir)
```

Sube el contenido de **`para-servidor/`** a tu hosting estático (raíz del sitio). Para regenerar tras cambios: `npm run pack:server`.

## Cómo usar el XML en la instalación

1. Genera y descarga **`autounattend.xml`** desde la web.
2. Colócalo en la **raíz del medio USB** (junto a `setup.exe` / estructura de la ISO desplegada).
3. **Prueba siempre en una máquina virtual** antes de un PC real: ediciones Home/Pro y builds de Windows 11 varían en políticas y OOBE.

## Palabras clave (búsqueda / topics de GitHub)

`autounattend` · `unattend.xml` · `Windows 11` · `Windows 10` · `instalación desatendida` · `answer file` · `OOBE` · `español` · `generador` · `Kybernatech`

Sugerencia: en GitHub añade topics como `windows-11`, `unattend`, `autounattend`, `spanish`, `vite`, `react`.

## Contribuciones y estrellas

Las **issues** y **pull requests** son bienvenidas (correcciones de texto, nuevas directivas documentadas, accesibilidad de la UI, traducciones).

Si te gusta el proyecto:

1. Dale **Star** arriba a la derecha en GitHub.
2. Comparte **[w11.kybernatech.com](https://w11.kybernatech.com)** con quien instale Windows a menudo.

## Aviso legal

Las plantillas y comandos se ofrecen **sin garantía**. Eres responsable del cumplimiento de licencias de Microsoft y del uso del equipo. No sustituye documentación oficial ni soporte de Microsoft.

## Enlaces útiles

- [Crear archivos de respuesta (Microsoft Learn)](https://learn.microsoft.com/es-es/windows-hardware/manufacture/desktop/update-windows-settings-and-scripts-create-your-own-answer-file-sxs)
- [Generador de referencia (Schneegans)](https://schneegans.de/windows/unattend-generator/)

---

**Sitio público:** [https://w11.kybernatech.com](https://w11.kybernatech.com) · Proyecto por la comunidad / Kybernatech
