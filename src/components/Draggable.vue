<template>
  <div class="draggable" :style="position_style" @mousedown="mousedown">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Draggable",
  props: {
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
  mounted() {
    let boundingRect = this.$el.getBoundingClientRect();
    if (this.startX === null)
      this.x = window.innerWidth / 2 - boundingRect.width / 2;
    if (this.startY === null)
      this.y = window.innerHeight / 2 - boundingRect.height / 2;
  },
  data() {
    return {
      x: this.startX,
      y: this.startY,
      offx: 0,
      offy: 0
    };
  },
  computed: {
    position_style() {
      return {
        left: this.x + "px",
        top: this.y + "px"
      };
    }
  },
  methods: {
    moveTo(x, y) {
      this.x = x - this.offx;
      this.y = y - this.offy;
    },
    mousedown(e) {
      e.preventDefault();
      this.offx = e.clientX - this.$el.getBoundingClientRect().left;
      this.offy = e.clientY - this.$el.getBoundingClientRect().top;

      document.body.style.cursor = "move";

      let moveTo = this.moveTo;
      function dragTo(e) {
        moveTo(e.pageX, e.pageY);
      }
      document.addEventListener("mousemove", dragTo);

      function removeMouseDownEventListeners() {
        document.removeEventListener("mousemove", dragTo);
        document.removeEventListener("mouseup", removeMouseDownEventListeners);
        document.body.style.cursor = "default";
        this.$emit("position-change", {
          x: this.x,
          y: this.y
        });
      }
      document.addEventListener("mouseup", removeMouseDownEventListeners);
    }
  }
};
</script>
<style lang="scss">
.draggable {
  position: absolute;
}
</style>

