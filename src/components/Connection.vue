<template>
  <canvas class="connection" :style="position_style"></canvas>
</template>
<script>
export default {
  name: "Connection",
  props: {
    id: String,
    startPos: {
      type: Object,
      required: true
    },
    endPos: {
      type: Object,
      required: true
    }
  },
  mounted() {
    this.update(this.startPos);
    this.update(this.endPos);
  },
  data() {
    return {
      margin: 10
    };
  },
  watch: {
    startPos: {
      handler(newVal) {
        this.update(newVal);
      },
      deep: true
    },
    endPos: {
      handler(newVal) {
        this.update(newVal);
      },
      deep: true
    }
  },
  computed: {
    /**
     * Returns the width of the connection or, canvas width minus the margin.
     */
    width() {
      return Math.abs(this.endPos.x - this.startPos.x);
    },
    /**
     * Returns the height of the connection or, canvas height minus the margin.
     */
    height() {
      return Math.abs(this.endPos.y - this.startPos.y);
    },
    position_style() {
      let canvasPos = {};

      if (this.endPos.x < this.startPos.x)
        canvasPos.x = this.endPos.x - this.margin;
      else canvasPos.x = this.startPos.x - this.margin;

      if (this.endPos.y < this.startPos.y)
        canvasPos.y = this.endPos.y - this.margin;
      else canvasPos.y = this.startPos.y - this.margin;

      return {
        left: canvasPos.x + "px",
        top: canvasPos.y + "px"
      };
    }
  },
  methods: {
    update(newPos) {
      this.$el.width = this.width + 2 * this.margin;
      this.$el.height = this.height + 2 * this.margin;

      let lineStart = {};
      let lineEnd = {};
      let ctrlStart = {};
      let ctrlEnd = {};

      if (this.endPos.x < this.startPos.x) {
        lineStart.x = this.width + this.margin;
        lineEnd.x = this.margin;

        ctrlStart.x = this.width + this.margin;
        ctrlEnd.x = this.margin;
      } else {
        lineStart.x = this.margin;
        lineEnd.x = this.width + this.margin;

        ctrlStart.x = this.margin;
        ctrlEnd.x = this.width + this.margin;
      }

      if (this.endPos.y < this.startPos.y) {
        lineStart.y = this.height + this.margin;
        lineEnd.y = this.margin;

        ctrlStart.y = (this.height + this.margin) / 2;
        ctrlEnd.y = (this.height + this.margin) / 2;
      } else {
        lineStart.y = this.margin;
        lineEnd.y = this.height + this.margin;

        ctrlStart.y = (this.height + this.margin) / 2;
        ctrlEnd.y = (this.height + this.margin) / 2;
      }

      this.drawConnection(
        this.$el.getContext("2d"),
        lineStart,
        lineEnd,
        ctrlStart,
        ctrlEnd
      );
    },
    drawConnection(ctx, p1, p2, c1, c2) {
      ctx.fillStyle = "#000000";
      ctx.lineWidth = 5;
      // Reset the current path
      ctx.beginPath();
      // Staring point (x1, y1)
      ctx.moveTo(p1.x, p1.y);
      // End point (x2, y2)
      // ctx.lineTo(x2, y2);
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, p2.x, p2.y);
      // Make the line visible
      ctx.stroke();
    }
  }
};
</script>
<style lang="scss">
.connection {
  position: absolute;
}
</style>
