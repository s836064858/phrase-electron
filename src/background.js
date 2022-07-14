'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, webContents } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { windowTop } from './main/windowTop'
import { changeWindowSize } from './main/changeWindowSize'
const isDevelopment = process.env.NODE_ENV !== 'production'

let win

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createMenu() {
  Menu.setApplicationMenu(null)
}

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 200,
    minHeight: 100,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      devTools: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL('app://./index.html')
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  createMenu()
  //监听窗口大小的变化
  win.on('resized', () => {
    win.webContents.send('sizeChange', win.getSize())
  })
})

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

ipcMain.on('window-top', windowTop)
ipcMain.on('change-window-size', changeWindowSize)
ipcMain.on('close', () => {
  win = null
  app.exit()
})
