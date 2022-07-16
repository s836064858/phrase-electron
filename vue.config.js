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
        copyright: 'Copyright © 2022 raozi'
      }
    }
  }
})
