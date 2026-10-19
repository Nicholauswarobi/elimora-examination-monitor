# Elimora Examination Monitor: downloads

This repository holds the installers for the **Elimora Examination Monitor**, the desktop app that some
Elimora examinations ask students to run beside the examination page. It contains no source code.

## Download

| Computer | Download |
|---|---|
| Windows 10 or 11, 64-bit | **[Elimora-Examination-Monitor-Setup-x64.exe](https://github.com/Nicholauswarobi/elimora-examination-monitor/releases/latest/download/Elimora-Examination-Monitor-Setup-x64.exe)** |
| macOS | Not available yet |
| Linux | Not available yet |

Every version: [Releases](https://github.com/Nicholauswarobi/elimora-examination-monitor/releases).
Step-by-step instructions and help: https://elimora-platform.vercel.app/download

## Install on Windows

1. Download the installer above.
2. Open it. It installs for your account only and does not ask for an administrator password.
3. Windows may show **"Windows protected your PC"**, because the installer is not code-signed yet.
   Check that you downloaded it from this page or from https://elimora-platform.vercel.app/download, then choose
   **More info** and **Run anyway**.
4. You do not need to open the app yourself. Open your examination on Elimora and press
   **Open the Examination Monitor**. When your browser asks whether to open it, allow it.

## What it does

- It runs only during a monitored examination, after you agree, and stops when you hand in.
- It never records your camera, microphone, keystrokes or files.
- It works only with Elimora at https://elimora-platform.vercel.app. It refuses to connect to any other site.

## Check your download (optional)

In PowerShell, in the folder you downloaded it to:

```powershell
Get-FileHash .\Elimora-Examination-Monitor-Setup-x64.exe -Algorithm SHA256
```

The result must match the SHA-256 in the release notes.

## Remove it

Settings, Apps, Installed apps, Elimora Examination Monitor, Uninstall.
