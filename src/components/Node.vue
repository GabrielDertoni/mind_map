<template>
  <Draggable
    class="node"
    :startX="x"
    :startY="y"
    @position-changing="handlePositionChanging"
    @position-changed="handlePositionChanging"
  >
    <div class="inner-container" :style="color_style">
      <h2>{{ title }}</h2>
      <div v-show="enable_description" class="description" @click="focusDescription">
        <textarea
          v-model="description"
          :class="{ 'has-content': description }"
          :id="identifier"
          name="description"
          cols="30"
          rows="10"
          @blur="blurDescription"
        ></textarea>
      </div>
      <div
        v-show="!enable_description"
        class="add-text-btn"
        :class="{ 'shrink-back': shrink_to_button }"
        @click="addDescription"
      >
        <img src="../assets/plus.svg" />
      </div>
    </div>
    <ConnectionPoint
      :id="identifier + '-connection-point'"
      v-slot="slotProps"
      @mouse-released="createConnection"
    ></ConnectionPoint>
  </Draggable>
</template>
<script>
import { setTimeout } from "timers";
import { mapGetters } from "vuex";
// import { mapMutations } from "vuex";

import Draggable from "./Draggable.vue";
import ConnectionPoint from "./ConnectionPoint.vue";
import Connection from "./Connection.vue";

export default {
  name: "Node",
  components: {
    Draggable,
    ConnectionPoint,
    Connection
  },
  props: {
    identifier: String,
    x: {
      type: Number,
      required: false,
      default: null
    },
    y: {
      type: Number,
      required: false,
      default: null
    },
    width: {
      type: Number,
      required: false,
      default: 310
    },
    height: {
      type: Number,
      required: false,
      default: 100
    }
  },
  mounted() {
    // if (this.width === null) this.width = 310;
    // if (this.height === null) this.height = 100;
  },
  data() {
    return {
      // Possible colors: red, green, blue, cian, magenta, yellow, brown, orange
      title: "Nova ideia",
      color: "red",
      enable_description: false,
      shrink_to_button: false,
      description: "",
      instConnectionPos: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    color_style() {
      switch (this.color) {
        case "red":
          return {
            "background-color": "hsl(0, 50%, 50%)"
          };
        case "green":
          return {
            "background-color": "hsl(120, 50%, 50%)"
          };
        case "blue":
          return {
            "background-color": "hsl(240, 50%, 50%)"
          };
        case "cian":
          return {
            "background-color": "hsl(180, 50%, 50%)"
          };
        case "magenta":
          return {
            "background-color": "hsl(300, 50%, 50%)"
          };
        case "yellow":
          return {
            "background-color": "hsl(60, 50%, 50%)"
          };
        case "brown":
          return {
            "background-color": "hsl(30, 70%, 50%)"
          };
        case "orange":
          return {
            "background-color": "hsl(30, 50%, 50%)"
          };
        default:
          return {
            "background-color": "hsl(0, 50%, 50%)"
          };
      }
    },
    children() {
      // const nodes = this.getNodes;
      // const childrenIDs = nodes.find(arr => arr.id === this.identifier)
      const childrenIDs = this.getNodeById(this.identifier).children;
      let children = [];
      for (let id of childrenIDs) {
        let child = this.getNodeById(id);
        children.push({
          ...child,
          inputPosition: {
            x: child.position.x + child.width / 2,
            y: child.position.y + child.height / 2
          }
        });
      }
      return children;
    },
    connectionPosition() {
      return {
        x: this.x + this.width / 2,
        y: this.y + this.height + 6
      };
    },
    ...mapGetters(["getNodes", "getNodeById"])
  },
  methods: {
    updateInstConnectionPos(newpos) {
      let boundingRect = this.$el.getBoundingClientRect();
      this.instConnectionPos = {
        x: newpos.x + boundingRect.width / 2,
        y: newpos.y + boundingRect.height - 6
      };
    },
    handlePositionChanging(newpos) {
      this.$store.commit("change-node-position", {
        id: this.identifier,
        position: newpos
      });
    },
    addDescription() {
      this.enable_description = true;

      // Wait for animation an then focus on the textarea.
      setTimeout(() => {
        this.focusDescription();
      }, 120);
    },
    focusDescription() {
      const textarea = this.$el.getElementsByTagName("textarea")["description"];
      textarea.focus();
    },
    blurDescription() {
      if (!this.description) {
        this.enable_description = false;
        this.shrink_to_button = true;
      }
    },
    createConnection(position) {
      let hoverNode = this.checkHoverNode(position);
      if (hoverNode && hoverNode != this.identifier) {
        this.$store.commit("create-connection", {
          from: this.identifier,
          to: hoverNode
        });
        return;
      }
      this.$store.commit("create-node", position);
      this.$store.commit("create-connection", {
        from: this.identifier,
        to: -1
      });
    },
    checkHoverNode(position) {
      let elements = document.elementsFromPoint(position.x, position.y);
      let nodeElement = elements.find(els => els.id.includes("node-"));
      if (!nodeElement) return null;
      return nodeElement.id.replace("node-", "");
    }
  }
};
</script>
<style lang="scss">
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");
.node {
  flex-flow: column nowrap;
  align-items: center;
  box-sizing: border-box;

  .inner-container {
    z-index: 2;
    box-sizing: border-box;
    color: white;
    font-family: "Roboto", sans-serif;
    min-width: 310px;
    border-radius: 12px;
    position: relative;
    padding: 5%;
    width: 90%;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;

    h2 {
      font-weight: bold;
      margin: 0;
    }

    .description {
      margin-top: 4%;
      width: 100%;

      textarea {
        resize: none;
        background: transparent;
        color: white;
        font-family: "Roboto", sans-serif;
        font-weight: normal;
        font-size: 15px;
        border: none;
        border: dashed 3px rgba(255, 255, 255, 0.6);
        transition: border-color ease 100ms;
        padding: 0.7em;
        animation: grow-to-textarea ease 0.4s forwards;
        width: 100%;
        box-sizing: border-box;

        &.has-content {
          border-color: rgba(255, 255, 255, 0);

          &:hover {
            border-color: rgba(255, 255, 255, 0.4);
          }
        }

        &:focus {
          outline: none;
          border-color: rgba(255, 255, 255, 0.8) !important;
        }
      }
    }

    .add-text-btn {
      margin-top: 4%;
      background: transparent;
      border: dashed 3px rgba(255, 255, 255, 0.6);
      width: 100%;
      height: 25px;
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;

      &.shrink-back {
        animation: shrink-to-button ease 0.4s forwards;
      }

      img {
        opacity: 0.6;
      }
    }
  }
}

@keyframes grow-to-textarea {
  from {
    height: 25px;
  }
  to {
    height: 100px;
  }
}
@keyframes shrink-to-button {
  from {
    height: 100px;
  }
  to {
    height: 25px;
  }
}
</style>
