<template>
  <canvas class="connection" :width="width" :height="height" :style="position_style"></canvas>
</template>
<script>
export default {
  name: "Connection",
  props: {
    x: {
      type: Number,
      required: true
    },
    y: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data() {
    return {};
  },
  mounted() {
    let ctx = this.$el.getContext("2d");
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, this.width, this.height);
  },
  computed: {
    position_style() {
      return {
        left: this.x1 + "px",
        top: this.y1 + "px"
      };
    }
  }
};
</script>
<style lang="scss">
.connection {
  position: absolute;
}
</style>
