<template>
<div>
    <b-button size="sm" v-b-modal.modal-1>Create a mock</b-button>
    <b-modal id="modal-1" title="BootstrapVue">
        <p class="my-4">Hello from modal!</p>
    </b-modal>
</div>
</template>

<script>
export default {
    props:['method','value'],
    data() {
      return {
        loading: null,
      }
    },
    mounted: function() {
    },
    created: function() {
    },
    methods: {
      }
  }
</script>

<style scoped>
</style>
