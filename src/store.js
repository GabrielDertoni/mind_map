import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    nodes: [
      {
        id: "0",
        position: {
          x: null,
          y: null
        },
        width: 320,
        height: 100,
        children: []
      }
    ]
  },
  getters: {
    getNodes: state => state.nodes,
    /**
     * Untraceable. If the state is updated the get wont be.
     */
    getNodeById: (state, getters) => id => getters.getNodes.find(nodes => nodes.id === id)
  },
  mutations: {
    'change-node-position': (state, payload) => {
      let node = state.nodes.find(nodes => nodes.id == payload.id);
      node.position = payload.position;
    },
    'create-node': (state, position) => {
      state.nodes.push({
        id: state.nodes.length.toString(),
        position: {
          x: position.x,
          y: position.y
        },
        width: 320,
        height: 100,
        children: []
      });
    },
    'create-connection': (state, payload) => {
      let { from, to } = payload;

      // Turn from into an index and if it is -1
      if (typeof from === "number" && from < 0) from = state.nodes.length + from;
      else from = state.nodes.findIndex(arr => arr.id === from);

      if (typeof to === "number" && to < 0) to = state.nodes[state.nodes.length + to].id;

      state.nodes[from].children.push(to);
    }
  },
  actions: {

  }
})
