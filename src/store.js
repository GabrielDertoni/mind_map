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
        children: []
      }
    ]
  },
  getters: {
    getNodes: state => state.nodes,
    getNodeById: state => id => state.nodes.find(nodes => nodes.id === id)
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
        children: []
      });
    },
    'create-connection': (state, payload) => {
      let idx = payload.from;
      if (idx < 0) idx = state.nodes.length + idx;
      state.nodes[idx].children.push(payload.to);
    }
  },
  actions: {

  }
})
