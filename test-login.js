const { app } = require('electron'); app.whenReady().then(() => { app.setLoginItemSettings({ openAtLogin: true, path: process.execPath, args: ['"' + app.getAppPath() + '"'] }); app.quit(); });
