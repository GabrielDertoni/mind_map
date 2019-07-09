<template>
  <Draggable class="node" @position-change="handlePositionChange">
    <div class="inner-container" :style="color_style">
      <h2>{{ title }}</h2>
      <div v-show="enable_description" class="description" @click="focusDescription">
        <textarea
          v-model="description"
          :id="id"
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
    <ConnectionPoint :id="id + '-connection'"></ConnectionPoint>
  </Draggable>
</template>
<script>
import { setTimeout } from "timers";
import Draggable from "./Draggable.vue";
import ConnectionPoint from "./ConnectionPoint.vue";

export default {
  name: "Node",
  components: {
    Draggable,
    ConnectionPoint
  },
  props: {
    id: String,
    startX: {
      type: Number,
      required: false,
      default: null
    },
    startY: {
      type: Number,
      required: false,
      default: null
    }
  },
  data() {
    return {
      // Possible colors: red, green, blue, cian, magenta, yellow, brown, orange
      title: "Nova ideia",
      color: "red",
      enable_description: false,
      shrink_to_button: false,
      description: "",
      x: 0,
      y: 0
    };
  },
  mounted() {
    this.x = this.$el.getBoundingClientRect().left;
    this.y = this.$el.getBoundingClientRect().top;
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
    }
  },
  methods: {
    handlePositionChange(newpos) {
      this.x = newpos.x;
      this.y = newpos.y;
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
        border: dashed 3px rgba(255, 255, 255, 0.6);
        transition: border ease 100ms;
        padding: 0.7em;
        animation: grow-to-textarea ease 0.4s forwards;
        width: 100%;
        box-sizing: border-box;

        &:focus {
          outline: none;
          border: dashed 3px rgba(255, 255, 255, 0.8);
        }
      }
    }

    .add-text-btn {
      margin-top: 4%;
      background: transparent;
      border: dashed 3px rgba(255, 255, 255, 0.6);
      width: 100%;

      &.shrink-back {
        animation: shrink-to-button ease 0.4s forwards;
      }

      img {
        opacity: 0.6;
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
        height: auto;
      }
    }
  }
}
</style>
