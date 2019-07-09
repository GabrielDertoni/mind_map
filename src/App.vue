<template>
  <div id="app">
    <Node id="node0"></Node>
  </div>
</template>

<script>
import Node from "./components/Node.vue";
import ConnectioPoint from "./components/ConnectionPoint.vue";

export default {
  name: "app",
  components: {
    Node,
    ConnectioPoint
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
