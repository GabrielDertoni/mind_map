<template>
  <div class="connection-point">
    <div class="ball-container" @mousedown="mousedown">
      <div class="ball"></div>
    </div>
    <Connection :startPos="relmidpoint" :endPos="relmousepos"></Connection>
    <slot :relmidpoint="relmidpoint" :midpoint="midpoint"></slot>
  </div>
</template>

<script>
import Connection from "./Connection.vue";

export default {
  name: "ConnectionPoint",
  components: {
    Connection
  },
  props: {
    id: String
  },
  mounted() {
    this.recalculate_midpoint();
    this.updateMouseTo(this.midpoint.x, this.midpoint.y);
  },
  data() {
    return {
      /* Position of the mouse in absolute form. Used to track
         the position of the mouse while dragging */
      mousepos: {
        x: 0,
        y: 0
      },
      showPath_: false,
      /* Midpoint (center of the connection point) in absolute form,
         (0, 0) is the top left corner of the screen */
      midpoint: {
        x: 0,
        y: 0
      },
      /* Midpoint (center of the connection point) in relative form,
         (0, 0) is the top left corner of the component */
      relmidpoint: {
        x: 0,
        y: 0
      },
      /* Position of the mouse relative form, (0, 0) is the top left
         corner of the component. */
      relmousepos: {
        x: 0,
        y: 0
      }
    };
  },
  computed: {
    /**
     * Returns a canvas object that stores x, y, width and height values to be used
     * later by the <canvas> element.
     */
    canvas() {
      // canvas.margin is the margin from the start of any drawing to the end of the canvas.
      // Used to avoid cropping of some parts of the drawing when it encounters the canvas boundaries.
      let canvas = {
        margin: 20,
        width: this.mousepos.x - this.midpoint.x,
        height: this.mousepos.y - this.midpoint.y
      };
      if (this.mousepos.x < this.midpoint.x) {
        canvas.x = this.relmidpoint.x + canvas.width - canvas.margin;
      } else canvas.x = this.relmidpoint.x - canvas.margin;

      if (this.mousepos.y < this.midpoint.y) {
        canvas.y = this.relmidpoint.y + canvas.height - canvas.margin;
      } else canvas.y = this.relmidpoint.y - canvas.margin;

      return canvas;
    },
    /**
     * Returns an object to be used as a style in the <canvas> element.
     * It changes two attributes: left and top, that are relative to the top left corner
     * of the component.
     */
    position_style() {
      /* If the mouse is before the absolute midpoint set the left style to the relative */
      return {
        left: this.canvas.x + "px",
        top: this.canvas.y + "px"
      };
    }
  },
  methods: {
    recalculate_midpoint() {
      const boundingRect = this.$el.getBoundingClientRect();
      this.relmidpoint.x = boundingRect.width / 2;
      this.relmidpoint.y = boundingRect.height / 2;
      this.midpoint.x = boundingRect.x + boundingRect.width / 2;
      this.midpoint.y = boundingRect.y + boundingRect.height / 2;
    },
    updateMouseTo(x, y) {
      this.mousepos.x = x;
      this.mousepos.y = y;
      this.relmousepos.x = this.relmidpoint.x + (x - this.midpoint.x);
      this.relmousepos.y = this.relmidpoint.y + (y - this.midpoint.y);
    },
    mouseReleased() {
      this.$emit("mouse-released", this.mousepos);
    },
    mousedown(e) {
      e.preventDefault();
      e.stopPropagation();

      this.recalculate_midpoint();
      this.updateMouseTo(e.pageX, e.pageY);

      // set this.updateMouseTo() to a temporary variable so that it can be accessed from
      // within the dragTo() function
      let dragTo = (e => {
        this.updateMouseTo(e.pageX, e.pageY);
      }).bind(this);
      document.addEventListener("mousemove", dragTo);

      let removeMouseDownEventListeners = (() => {
        this.mouseReleased();
        this.updateMouseTo(this.midpoint.x, this.midpoint.y);
        document.removeEventListener("mousemove", dragTo);
        document.removeEventListener("mouseup", removeMouseDownEventListeners);
      }).bind(this);
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
