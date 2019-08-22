<template>
  <router-link :to="`/document/${id}`">
    <h3>{{ name }}</h3>
  </router-link>
</template>
<script>
export default {
  name: "Document",
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  },
  methods: {}
};
</script>

