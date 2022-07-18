<template>
  <div class="dialog-container">
    <!-- 弹窗头部 -->
    <div class="dialog-header-container">
      <div class="mac-header" v-if="isMac">
        <div class="icon-buttons">
          <div class="icon-button">
            <div class="icon-button-image close" @click="closeWindow"></div>
          </div>
        </div>
        <div class="title">{{ title }}</div>
      </div>
      <div class="windows-header" v-if="isWindows">
        <div class="title">{{ title }}</div>
        <div class="icon-buttons">
          <div class="icon-button close" @click="closeWindow" style="background-size: 20px 20px"></div>
        </div>
      </div>
    </div>
    <!-- 占位 -->
    <div style="height: 40px"></div>
    <div class="body-container">
      <slot></slot>
    </div>
    <!-- 尾部 -->
    <div class="dialog-button-container">
      <el-button size="small" @click="closeWindow">取消</el-button>
      <el-button size="small" type="primary" @click="confirm">确认</el-button>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from 'electron'
export default {
  props: {
    title: {
      type: String
    }
  },
  data() {
    return {
      isWindows: false,
      isMac: false
    }
  },
  mounted() {
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
     * @description: 关闭窗口
     * @return {*}
     */
    closeWindow() {
      ipcRenderer.send('dialog-close')
    },
    confirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss" scoped>
.dialog-container {
  height: 100%;
  padding: 0 5px 5px 5px;
}
.dialog-header-container {
  width: 100%;
  height: 35px;
  -webkit-user-select: none;
  position: fixed;
  top: 0;
  left: 0;
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
    width: 120px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
    width: 120px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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
.close {
  background: url('../assets/close.png');
}
.dialog-button-container {
  text-align: right;
  margin-top: 5px;
}
.body-container {
  min-height: calc(100% - 82px);
}
</style>
