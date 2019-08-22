import Vue from "vue";
import App from "./App.vue";
import store from './store'
import router from './router'

import { mapGetters } from "vuex";

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  computed: {
    ...mapGetters(["getUserId"])
  },
  mounted() {
    if (this.getUserId) {
      this.$store.dispatch('fetch-user');
    }
    this.$store.subscribe(((mutation, state) => {
      switch (mutation.type) {
        case 'set-user-id':
          if (state.uid) this.$store.dispatch('fetch-user');
          break;
      }
    }).bind(this));
  },
  render: h => h(App)
}).$mount("#app");
