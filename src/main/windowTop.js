import { BrowserWindow } from 'electron'
export function windowTop() {
  let currentWindow = BrowserWindow.getFocusedWindow()
  currentWindow.setAlwaysOnTop(!currentWindow.isAlwaysOnTop())
}
