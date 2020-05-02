<template>

  <div>
    <nav class="navbar navbar-light bg-light mb-3">
      <a class="navbar-brand" href="#">
        <i class="fa fa-bath" aria-hidden="true"></i>
        Make Mocks
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
        // backend_data:null
      }
    },
    mounted: function() {
      // this.stub()
    },
    created: function() {
    },
    methods: {
      //  stub: function(d) {
      //   return new Promise((resolve,reject)=>{
      //     fetch(this.$api + '/users', {
      //         method: 'POST',
      //         headers: {
      //           'Content-Type': 'application/json',
      //           'Authorization': this.get_auth_header()
      //         },
      //         body: JSON.stringify(d),
      //       })
      //       .then(res => res.json())
      //       .then(data => {
      //         console.log(data)
      //         this.backend_data=data
      //         resolve(data)
      //       }).catch(e => {
      //         this.error = e; console.error('exception:', e);
      //       })
      //     })
      // },
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
