const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    proxy: {
      '/front': {
        target: 'http://120.48.32.48:3000/',
        // target: 'http://localhost:3000/',
        changeOrigin: true
      }
    }
  },
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        productName: '常用短语',
        copyright: 'Copyright © 2022 raozi',
        mac: {
          icon: './src/assets/icon_512x512.png' //图标路径
        },
        win: {
          icon: './public/favicon.ico'
        },
        nsis: {
          oneClick: false,
          allowToChangeInstallationDirectory: true,
          installerIcon: './public/favicon.ico', // 安装图标
          createDesktopShortcut: true // 创建桌面图标
        }
      }
    }
  }
})
