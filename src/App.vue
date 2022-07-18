<template>
  <div id="app">
    <template v-if="noHeader">
      <router-view></router-view>
    </template>
    <template v-else>
      <Header></Header>
      <div style="padding: 5px; margin-top: 35px">
        <router-view></router-view>
      </div>
    </template>
  </div>
</template>
<script>
import Header from './components/header'
export default {
  data() {
    return {
      noHeader: false
    }
  },
  components: {
    Header
  },
  methods: {},
  mounted() {
    if (this.$route.meta?.noHeader) this.noHeader = true
  }
}
</script>
<style>
* {
  box-sizing: border-box;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
  height: 100%;
  width: 100%;
}
::-webkit-scrollbar {
  width: 10px;
  height: 8px;
}
::-webkit-scrollbar-track {
  border-radius: 8px;
}
::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.1);
}
</style>
