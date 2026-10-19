# Elimora Examination Monitor: downloads

This repository holds the installers for the **Elimora Examination Monitor**, the desktop app that some
Elimora examinations ask students to run beside the examination page. It contains no source code.

> **Elimora's address is [www.elimora.co.tz](https://www.elimora.co.tz)** (`elimora.co.tz` opens the
> same site). The app connects to Elimora at that address and nowhere else.

## Download

| Computer | Download |
|---|---|
| Windows 10 or 11, 64-bit | **[Elimora-Examination-Monitor-Setup-x64.exe](https://github.com/Nicholauswarobi/elimora-examination-monitor/releases/latest/download/Elimora-Examination-Monitor-Setup-x64.exe)** |
| macOS | Not available yet |
| Linux | Not available yet |

Every version: [Releases](https://github.com/Nicholauswarobi/elimora-examination-monitor/releases).
Step-by-step instructions and help: https://www.elimora.co.tz/download

**Installed version 1.0.0? Install the latest version over it.** Version 1.0.0 was a test build that
only worked with a temporary test address, so it cannot connect to your examination on
www.elimora.co.tz. Installing the new version replaces it; you do not need to uninstall first.

## Install on Windows

1. Download the installer above.
2. Open it. It installs for your account only and does not ask for an administrator password.
3. Windows may show **"Windows protected your PC"**, because the installer is not code-signed yet.
   Check that you downloaded it from this page or from https://www.elimora.co.tz/download, then choose
   **More info** and **Run anyway**.
4. You do not need to open the app yourself. Open your examination on https://www.elimora.co.tz and
   press **Open the Examination Monitor**. When your browser asks whether to open it, allow it.

## What it does

- It runs only during a monitored examination, after you agree, and stops when you hand in.
- It never records your camera, microphone, keystrokes or files.
- It works only with Elimora at https://www.elimora.co.tz. It refuses to connect to any other site.

## Check your download (optional)

In PowerShell, in the folder you downloaded it to:

```powershell
Get-FileHash .\Elimora-Examination-Monitor-Setup-x64.exe -Algorithm SHA256
```

The result must match the SHA-256 in the release notes.

## Remove it

Settings, Apps, Installed apps, Elimora Examination Monitor, Uninstall.
