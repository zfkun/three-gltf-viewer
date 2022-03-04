const {app, BrowserWindow, globalShortcut} = require('electron')
const {autoUpdater} = require("electron-updater")
const log = require('electron-log')
const path = require('path')

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

function sendStatusToWindow(text) {
  log.info(text);
  win.webContents.send('message', text);
}

function createWindow () {
  createShortcut()

  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 700,
  })

  if (app.isPackaged) {
    mainWindow.loadFile(path.join(__dirname, 'public/index.html'))
  }
  else {
    mainWindow.loadFile(path.join(__dirname, '../public/index.html'))
  }
}

function createShortcut() {
  globalShortcut.register('F5', function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.reload();
    }
  });
  globalShortcut.register('CommandOrControl+F5', function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.session.clearCache(() => {
        win.reload();
      });
    }
  });
}


// auto update
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
});
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
});
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
});
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
