import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase/app';
import 'firebase/firestore';
import { async } from 'q';

const firebaseConfig = {
  apiKey: "AIzaSyAqmVIjiqbd_M1V4WfMObESXI12gxyX0x8",
  authDomain: "mind-map-86546.firebaseapp.com",
  databaseURL: "https://mind-map-86546.firebaseio.com",
  projectId: "mind-map-86546",
  storageBucket: "",
  messagingSenderId: "31279324555",
  appId: "1:31279324555:web:67c1dbd587d1500f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const database = firebase.firestore();

Vue.use(Vuex)


const nodeDefault = {
  id: "0",
  title: "",
  description: "",
  position: {
    x: null,
    y: null
  },
  width: 320,
  height: 100,
  children: []
}
function parseNodes(nodes) {
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    for (const key in nodeDefault) {
      if (typeof node[key] !== typeof nodeDefault[key]) node[key] = nodeDefault[key];
    }
  }
  return nodes;
}

export default new Vuex.Store({
  state: {
    loading: false,
    uid: "H0qzySq8XRukO1yM990Y",
    documents: [],
    nodes: []
  },
  getters: {
    getNodes: state => state.nodes,
    /**
     * Untraceable. If the state is updated the get wont be.
     */
    getNodeById: (state, getters) => id => getters.getNodes.find(node => node.id === id),
    getUserId: state => state.uid,
    getLoadingStatus: state => state.loading,
    getDocuments: state => state.documents,
    getDocuments: state => state.documents,
    getDocumentById: (state, getters) => id => getters.getDocuments.find(document => document.id === id)
  },
  mutations: {
    'change-node-position': (state, payload) => {
      let node = state.nodes.find(nodes => nodes.id == payload.id);
      node.position = payload.position;
    },
    'change-node-description': (state, payload) => {
      const node = state.nodes.find(node => node.id === payload.id);
      node.description = payload.description;
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
    },
    'set-user-id': (state, uid) => {
      state.uid = uid;
    },
    'refactor-nodes': (state, nodes) => {
      if (nodes === undefined || nodes === null) state.nodes = [nodeDefault];
      else state.nodes = nodes;
    },
    'set-documents': (state, documents) => {
      state.documents = documents;
    },
    'set-loading': (state, loading) => {
      state.loading = loading;
    }
  },
  actions: {
    'fetch-user': async ({ getters, commit }) => {
      await database.collection("Users").doc(getters.getUserId).onSnapshot(snapshot => {
        const user = snapshot.data();
        commit('set-documents', user.documents);
      })
    },
    'fetch-mindmap': async ({ getters, commit }, id) => {
      await database.collection("Users")
        .doc(getters.getUserId)
        .collection("documentData")
        .doc(id)
        .onSnapshot(snapshot => {
          const nodes = snapshot.data().nodes;
          commit('refactor-nodes', parseNodes(nodes));
        });
    },
    'save-mindmap': async ({ getters }, id) => {
      await database.collection("Users")
        .doc(getters.getUserId)
        .collection("documentData")
        .doc(id)
        .update({
          nodes: getters.getNodes
        });
    },
    'create-mindmap': async ({ getters }) => {
      const userRef = database.collection("Users").doc(getters.getUserId);
      const docId = (await userRef.collection("documentData").add({
        nodes: getters.getNodes
      })).id;
      await userRef.update({
        documents: [
          {
            // TODO: Insert name
            name: "Some name",
            id: docId
          },
          ...getters.getDocuments
        ]
      })
    }
  }
})
