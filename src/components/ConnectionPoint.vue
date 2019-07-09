<template>
  <!-- <Draggable class="connection-point"> -->
  <div class="connection-point" @mousedown="mousedown">
    <div class="ball-container">
      <div class="ball"></div>
    </div>
    <canvas class="connection" :style="position_style"></canvas>
    <!-- <Connection :x="midx" :y="midy" :width="connectionWidth" :height="connectionHeight"></Connection> -->
  </div>
  <!-- </Draggable> -->
</template>

<script>
// import Draggable from "./Draggable.vue";
import Connection from "./Connection.vue";

export default {
  name: "ConnectionPoint",
  components: {
    Connection
  },
  props: {},
  data() {
    return {
      mouseX: 0,
      mouseY: 0,
      showPath_: false,
      midx: 0,
      midy: 0,
      relmidx: 0,
      relmidy: 0,
      margin: 10
    };
  },
  computed: {
    position_style() {
      let style = {
        // width: this.connectionWidth + "px",
        // height: this.connectionHeight + "px"
      };
      if (this.mouseX < this.midx)
        style.left =
          this.relmidx + (this.mouseX - this.midx) - this.margin + "px";
      else style.left = this.relmidx - this.margin + "px";

      if (this.mouseY < this.midy)
        style.top =
          this.relmidy + (this.mouseY - this.midy) - this.margin + "px";
      else style.top = this.relmidy - this.margin + "px";

      return style;
    }
  },
  methods: {
    setConnectionDimentions() {
      let newWidth = Math.abs(this.mouseX - this.midx);
      let newHeight = Math.abs(this.mouseY - this.midy);
      let canvas = this.$el.getElementsByTagName("canvas")[0];
      canvas.width = newWidth + 2 * this.margin;
      canvas.height = newHeight + 2 * this.margin;
      this.drawConnection(canvas);
    },
    recalculate_midpoint() {
      const boundingRect = this.$el.getBoundingClientRect();
      this.relmidx = boundingRect.width / 2;
      this.relmidy = boundingRect.height / 2;
      this.midx = boundingRect.x + boundingRect.width / 2;
      this.midy = boundingRect.y + boundingRect.height / 2;
      this.setConnectionDimentions();
    },
    drawConnection(canvas) {
      let ctx = canvas.getContext("2d");
      let x1 = this.margin;
      if (this.mouseX < this.midx) x1 = canvas.width - this.margin;

      let y1 = this.margin;
      if (this.mouseY < this.midy) y1 = canvas.height - this.margin;

      let x2 = canvas.width - this.margin;
      if (this.mouseX < this.midx) x2 = this.margin;

      let y2 = canvas.height - this.margin;
      if (this.mouseY < this.midy) y2 = this.margin;

      this.drawLine(ctx, x1, y1, x2, y2);
    },
    drawLine(ctx, x1, y1, x2, y2) {
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 5;
      // Reset the current path
      ctx.beginPath();
      // Staring point (10,45)
      ctx.moveTo(x1, y1);
      // End point (180,47)
      ctx.lineTo(x2, y2);
      // Make the line visible
      ctx.stroke();
    },
    moveTo(x, y) {
      this.mouseX = x;
      this.mouseY = y;
      this.setConnectionDimentions();
    },
    showPath() {
      this.showPath_ = true;
    },
    hidePath() {
      this.showPath_ = false;
    },
    mousedown(e) {
      e.preventDefault();
      e.stopPropagation();

      this.recalculate_midpoint();
      this.showPath();

      // document.body.style.cursor = "move";
      let moveTo = this.moveTo;
      function dragTo(e) {
        moveTo(e.pageX, e.pageY);
      }
      document.addEventListener("mousemove", dragTo);

      let hidePath = this.hidePath;
      function removeMouseDownEventListeners() {
        hidePath();
        document.removeEventListener("mousemove", dragTo);
        document.removeEventListener("mouseup", removeMouseDownEventListeners);
        // document.body.style.cursor = "default";
      }
      document.addEventListener("mouseup", removeMouseDownEventListeners);
    }
  }
};
</script>
<style lang="scss">
.connection-point {
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  position: relative;
  z-index: 1;

  .ball-container {
    width: 40px;

    .ball {
      margin-top: -70%;
      padding-top: 100%;
      background-color: rgb(90, 0, 0);
      border-radius: 50%;
    }
  }

  .connection {
    position: absolute;
    z-index: -1;
  }
}
</style>
