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

    this.$emit("position-changed", { x: this.x, y: this.y });
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
      this.$emit("position-changing", { x: this.x, y: this.y });
    },
    mousedown(e) {
      let boundingRect = this.$el.getBoundingClientRect();
      // If mousedown is outside of the bounding rect, ignore it.
      if (
        e.pageX < boundingRect.x ||
        e.pageX > boundingRect.x + boundingRect.width ||
        e.pageY < boundingRect.y ||
        e.pageY > boundingRect.y + boundingRect.height
      ) {
        return;
      }

      e.preventDefault();

      this.offx = e.clientX - boundingRect.left;
      this.offy = e.clientY - boundingRect.top;

      document.body.style.cursor = "move";

      let dragTo = (e => {
        this.moveTo(e.pageX, e.pageY);
      }).bind(this);
      document.addEventListener("mousemove", dragTo);

      let removeMouseDownEventListeners = (() => {
        document.removeEventListener("mousemove", dragTo);
        document.removeEventListener("mouseup", removeMouseDownEventListeners);
        document.body.style.cursor = "default";
        this.$emit("position-changed", { x: this.x, y: this.y });
      }).bind(this);
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

