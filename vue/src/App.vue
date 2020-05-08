<template>

  <div>
      <b-avatar variant="primary" class="float-left m-2 ml-3"><i style="font-size:45px;" class="fas fa-snowman"></i></b-avatar>
    <nav class="navbar navbar-light bg-light mb-3">
      <a class="navbar-brand" href="#">
        Snowman
      </a>
    </nav>
      <div class='row'>
        <div class="col">
          <!-- <MocksList/> -->
          <ServiceList/>
          </div>
      </div>
  </div>

</template>
 
<script>
import { EventBus } from './EventBus.js';
export default {
    name: 'microfrontend',
    data() {
      return {
        error: false,
        loading: false,
        service: null
      }
    },
    mounted: function() {
      // this.stub()
    },
    created: function() {
    },
    methods: {
      },
  }
</script>

<style>
.button{
  cursor: pointer;
  border: 1px solid gray;
  padding: 5px;
}
.button:hover{
  background: gray;
}
.button:active{
  background: black;
  color: white;
}
</style>
<style scoped>
.main_app{
}
</style>
