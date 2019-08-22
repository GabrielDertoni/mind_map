<template>
  <div class="home">
    <h1>My Mind Maps</h1>
    <div v-if="documents.length > 0" class="docs-container">
      <Document v-for="(doc, index) in documents" :name="doc.name" :id="doc.id" :key="index"></Document>
    </div>
    <router-link to="/document" class="add-document">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z" />
      </svg>
    </router-link>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Document from "../components/Document.vue";

export default {
  name: "home",
  components: {
    Document
  },
  computed: {
    ...mapGetters({
      loading: "getLoadingStatus",
      documents: "getDocuments"
    })
  }
};
</script>
