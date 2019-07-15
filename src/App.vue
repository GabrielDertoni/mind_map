<template>
  <div id="app">
    <!-- <div v-for="node in nodes" :key="node.id + '_connections'">
      <Connection
        v-for="childID in node.children"
        :startPos="node.position"
        :endPos="getNodeById(childID).position"
        :key="node.id + '-connection-' + childID"
      ></Connection>
    </div>-->
    <Node
      v-for="node in nodes"
      :identifier="node.id"
      :startX="node.position.x"
      :startY="node.position.y"
      :startWidth="node.width"
      :startHeight="node.height"
      :key="node.id"
      :id="'node-' + node.id"
    ></Node>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Node from "./components/Node.vue";
import Connection from "./components/Connection.vue";

export default {
  name: "app",
  components: {
    Node,
    Connection
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      nodes: "getNodes",
      getNodeById: "getNodeById"
    })
  },
  methods: {
    getNodeConnectionPoint(id) {
      let boundingRect = document.getElementById(id).getBoundingClientRect();
      return {
        x: boundingRect.x + boundingRect.width / 2,
        y: boundingRect.y + boundingRect.height - 6
      };
    }
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
