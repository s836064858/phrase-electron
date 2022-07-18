'use strict'

import { app, protocol, BrowserWindow, Menu, ipcMain, Tray } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { changeWindowSize } from './main/changeWindowSize'
const path = require('path')
const isDevelopment = process.env.NODE_ENV !== 'production'

let win, tray
let winURL = process.env.WEBPACK_DEV_SERVER_URL ? process.env.WEBPACK_DEV_SERVER_URL : 'app://./index.html'
//获取icon地址
const iconUrl = isDevelopment ? path.join(__dirname, '../public/icon_32x32.png') : path.join(__dirname, 'icon_32*32.png')

protocol.registerSchemesAsPrivileged([{ scheme: 'app', privileges: { secure: true, standard: true } }])

function createMenu() {
  Menu.setApplicationMenu(null)
}
//设置托管图标
function createTray() {
  tray = new Tray(iconUrl)
  tray.setToolTip('常用短语')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '显示',
      click: () => {
        win.show()
      }
    },
    {
      label: '置顶',
      click: () => {
        win.setAlwaysOnTop(!win.isAlwaysOnTop())
      }
    },
    {
      label: '退出',
      click: () => {
        win = null
        app.exit()
      }
    }
  ])
  // 载入托盘菜单
  tray.setContextMenu(contextMenu)
  // 双击触发
  tray.on('double-click', () => {
    // 双击通知区图标实现应用的显示或隐藏
    win.isVisible() ? win.hide() : win.show()
    win.isVisible() ? win.setSkipTaskbar(false) : win.setSkipTaskbar(true)
  })
  tray.on('click', () => {
    if (!win.isVisible()) win.show()
    if (win.isMinimized()) win.restore()
  })
}

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 200,
    minHeight: 100,
    frame: false,
    alwaysOnTop: true,
    icon: iconUrl,
    webPreferences: {
      devTools: true,
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    await win.loadURL(winURL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    win.loadURL(winURL)
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
  createTray()
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
// 更改窗口大小
ipcMain.on('change-window-size', changeWindowSize)
// 关闭窗口
ipcMain.on('close', () => {
  win = null
  app.exit()
})
// 隐藏窗口
ipcMain.on('hideWindow', () => {
  let currentWindow = BrowserWindow.getFocusedWindow()
  currentWindow.minimize()
})
