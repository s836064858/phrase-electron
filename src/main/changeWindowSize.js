import { BrowserWindow } from 'electron'
export function changeWindowSize(event, size) {
  console.log('changeWindowSize', size.width)
  let currentWindow = BrowserWindow.getFocusedWindow()
  currentWindow.setSize(size.width, size.height)
}
