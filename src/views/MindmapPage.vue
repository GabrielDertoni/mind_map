<template>
  <div class="page mindmap">
    <h1>{{ getDocumentById($route.params.id) ? getDocumentById($route.params.id).name : "" }}</h1>
    <div class="save-btn" @click="save">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z"
        />
      </svg>
    </div>
    <Mindmap :id="$route.params.id"></Mindmap>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

import Mindmap from "../components/Mindmap.vue";

export default {
  name: "MindmapPage",
  components: {
    Mindmap
  },
  computed: {
    ...mapGetters(["getDocumentById"])
  },
  methods: {
    save() {
      if (!this.$route.params.id) {
        this.$store.dispatch("create-mindmap").then(() => {
          confirm("Document created successfully!");
        });
      } else {
        this.$store.dispatch("save-mindmap", this.$route.params.id).then(() => {
          confirm("Saved successfully!");
        });
      }
    }
  }
};
</script>
<style lang="scss">
.save-btn {
  position: absolute;
  top: 0;
  right: 0;
  margin: 3em;
  cursor: pointer;
  svg {
    width: 2em;
    height: auto;
  }

  &:hover {
    svg {
      path {
        fill: rgb(109, 109, 109);
      }
    }
  }
}
</style>


