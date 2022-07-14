<template>
  <div id="app">
    <Header></Header>
    <div style="padding: 5px; margin-top: 35px">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Header from './components/header'
export default {
  data() {
    return {}
  },
  components: {
    Header
  },
  methods: {}
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
}
&::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
&::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: #d4a066;
}
&::-webkit-scrollbar-track {
  background: #f3f3f3;
}
</style>
