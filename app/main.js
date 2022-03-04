// Modules to control application life and create native browser window
const {app, BrowserWindow, globalShortcut} = require('electron')
const path = require('path')

function createWindow () {
  createShortcut()

  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 700,
  })

  mainWindow.loadFile(path.join(__dirname, 'public/index.html'))
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
  globalShortcut.register('Escape', function () {
    app.quit();
  });
  globalShortcut.register('CommandOrControl+F9', function () {
    let win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.isDevToolsOpened() ?
        win.webContents.closeDevTools() :
        win.webContents.openDevTools();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

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
