<template>
<div>
  <div>
                    <div class='float-right'>
                      <NewMockModal
                        :service="service"
                        :path="path"
                        :method="method"
                      />
                    </div>
                    <h5>Mocks</h5>
                      
                    <p>
                      Mocks are parameter sets for the api specs. <br>You can define request and response headers, parameters and body, 
                    </p>
                    </div>
                    <b-tabs pills  vertical>
                      <b-tab title='mikek'>asdfasf</b-tab>
                      <!-- <b-tab v-for="(method,m) in service.spec.paths[path]" :key="m"></b-tab> -->
                    </b-tabs>
</div>
</template>

<script>

export default {
    props:['service','path','method'],
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
