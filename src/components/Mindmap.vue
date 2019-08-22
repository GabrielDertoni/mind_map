<template>
  <div class="mindmap">
    <div v-for="node in nodes" :key="node.id + '_connections'">
      <Connection
        v-for="childID in node.children"
        :startPos="calculateOutputPosition(node)"
        :endPos="calculateInputPosition(getNodeById(childID))"
        :key="node.id + '-connection-' + childID"
      ></Connection>
    </div>
    <Node
      v-for="node in nodes"
      :identifier="node.id"
      :x="node.position.x"
      :y="node.position.y"
      :width="node.width"
      :height="node.height"
      :key="node.id"
      :id="'node-' + node.id"
    ></Node>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Node from "./Node.vue";
import Connection from "./Connection.vue";

export default {
  name: "Mindmap",
  components: {
    Node,
    Connection
  },
  props: {
    id: {
      type: String,
      required: false
    }
  },
  created() {
    if (this.id) this.$store.dispatch("fetch-mindmap", this.id);
    else this.$store.commit("refactor-nodes");
  },
  computed: {
    ...mapGetters({
      nodes: "getNodes",
      getNodeById: "getNodeById",
      getDocumentById: "getDocumentById"
    })
  },
  methods: {
    calculateInputPosition(node) {
      return {
        x: node.position.x + node.width / 2,
        y: node.position.y + node.height / 2
      };
    },
    calculateOutputPosition(node) {
      return {
        x: node.position.x + node.width / 2,
        y: node.position.y + node.height + 6
      };
    },
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
.mindmap {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
