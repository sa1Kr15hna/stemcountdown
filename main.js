const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

ipcMain.on('resize-window', (event, { width, height }) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    win.setContentSize(Math.round(width), Math.round(height));
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1150,
    height: 250,
    frame: false,
    transparent: true,
    resizable: false,
    maximizable: false,
    hasShadow: false,
    alwaysOnTop: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
  win.setMenu(null);

  // Read config.json when window is ready
  win.webContents.on('did-finish-load', () => {
    // Get the path to where the executable or main.js is
    const appPath = app.isPackaged ? path.dirname(app.getPath('exe')) : __dirname;
    const configPath = path.join(appPath, 'config.json');

    let configObject = { startDate: "2026-02-01", endDate: "2028-01-31" }; // Defaults

    if (fs.existsSync(configPath)) {
      try {
        const fileContent = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.startDate && parsed.endDate) {
          configObject = parsed;
        }
      } catch (err) {
        console.error("Error parsing config.json:", err);
      }
    }

    win.webContents.send('init-config', configObject);
  });

  // Optional: keep it behind other windows to simulate a desktop widget
  if (process.platform === 'win32') {
    win.setSkipTaskbar(true); // Don't show in taskbar
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Automatically start the widget on system boot (only when packaged)
  if (app.isPackaged) {
    app.setLoginItemSettings({
      openAtLogin: true
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
