<template>
  <div class="electron-header-container">
    <div class="mac-header" v-if="isMac">
      <div class="icon-buttons">
        <div class="icon-button">
          <div class="icon-button-image close" @click="closeWindow"></div>
        </div>
        <!-- <div class="icon-button" style="background: #f3c948" @click="alwaysTop">
          <div class="icon-button-image top"></div>
        </div> -->
        <div class="icon-button" style="background: #6cd052" v-if="!isSmallSize">
          <div class="icon-button-image minimize" @click="minimize('min')"></div>
        </div>
        <div class="icon-button" style="background: #6cd052" v-else>
          <div class="icon-button-image maximize" @click="minimize('max')"></div>
        </div>
      </div>
      <div class="title">{{ title }}</div>
    </div>
    <div class="windows-header" v-if="isWindows">
      <div class="title">{{ title }}</div>
      <div class="icon-buttons">
        <div class="icon-button minimize" v-if="!isSmallSize" @click="minimize('min')"></div>
        <div class="icon-button maximize" v-else @click="minimize('max')"></div>
        <!-- <div class="icon-button top" @click="alwaysTop"></div> -->
        <div class="icon-button close" @click="closeWindow" style="background-size: 20px 20px"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron'
export default {
  data() {
    return {
      isWindows: false,
      isMac: false,
      isSmallSize: false,
      title: '常用短语'
    }
  },
  mounted() {
    //监听窗口变化
    ipcRenderer.on('sizeChange', (e, size) => {
      if (size[0] <= 600 && size[1] <= 450) this.isSmallSize = true
      else this.isSmallSize = false
    })
    this.getOS()
  },
  methods: {
    /**
     * @description: 获取浏览器环境
     * @return {*}
     */
    getOS() {
      var agent = navigator.userAgent.toLowerCase()
      var isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      if (agent.includes('win') || agent.includes('wow')) this.isWindows = true
      if (isMac) this.isMac = true
    },
    /**
     * @description: 置顶与取消置顶
     * @return {*}
     */
    alwaysTop() {
      ipcRenderer.send('window-top')
    },
    /**
     * @description: 最小最大化
     * @param {*} type
     * @return {*}
     */
    minimize(type) {
      console.log(type)
      this.isSmallSize = type === 'min'
      ipcRenderer.send('change-window-size', {
        width: type === 'min' ? 500 : 800,
        height: type === 'min' ? 250 : 600
      })
    },
    /**
     * @description: 关闭窗口
     * @return {*}
     */
    closeWindow() {
      console.log(123)
      ipcRenderer.send('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.electron-header-container {
  width: 100%;
  height: 35px;
  -webkit-app-region: drag;
  -webkit-user-select: none;
  position: fixed;
  top: 0;
  z-index: 9999;
  background: #fff;
}
.mac-header {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  background: #f7f5f7;
  .title {
    margin: 0 auto;
    display: inline-block;
    line-height: 30px;
    font-size: 14px;
  }
  .icon-buttons {
    display: flex;
    align-items: center;
    position: absolute;
    left: 10px;
    height: 100%;
    .icon-button {
      border-radius: 50%;
      width: 14px;
      height: 14px;
      background: #ec7365;
      margin-right: 5px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .icon-button-image {
      width: 8px;
      height: 8px;
      background-position: center center;
      background-size: 100% 100%;
      background-repeat: no-repeat;
    }
  }
}
.windows-header {
  width: 100%;
  height: 30px;
  background: #f7f5f7;
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
  .title {
    line-height: 30px;
    font-size: 14px;
  }
  .icon-buttons {
    display: flex;
    align-items: center;
    height: 100%;
    .icon-button {
      border-radius: 50%;
      width: 34px;
      height: 30px;
      margin-right: 5px;
      cursor: pointer;
      background-position: center center;
      background-size: 14px 14px;
      background-repeat: no-repeat;
    }
  }
}
.icon-button {
  -webkit-app-region: no-drag;
}
.close {
  background: url('../assets/close.png');
}
.top {
  background-image: url('../assets/zhiding.png');
}
.minimize {
  background-image: url('../assets/zuixiaohua.png');
}
.maximize {
  background-image: url('../assets/zuidahua.png');
}
</style>
