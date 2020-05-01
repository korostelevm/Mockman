<template>
    <div class='main row'>
    <div class='mocks_menu col-md-2'>
      <div class="list-group" v-if='services'>
         <a href="#" class="list-group-item list-group-item-action"
            :class="{active: selected_service && s == selected_service}"
            v-for="s of services" v-bind:key="s.serviceId" 
            v-on:click="select_service(s)">
          {{s.Service}}
        </a>
      </div>
      <ServiceModal
        v-on:save="get_services"
      />
    </div>
    <div class='col-md-9'>
      <Service v-if="selected_service" :serviceId="selected_service.serviceId"
      v-on:remove="function(){selected_service=null; get_services()}"
      v-on:save="get_services"
       />
    </div>
    <div class='col-md-1'>
    </div>
    </div>
</template>

<script>
import { EventBus } from '../../EventBus.js';
export default {
    name: 'ServiceList',
    data() {
      return {
        error: null,
        loading: null,
        timeout:null,
        services: null,
        selected_service: null,
      }
    },
    mounted: function() {
      this.get_services()
    },
    created: function() {
    },
    methods: {
        select_service: function(service){
          this.selected_service = service
        },
        get_services: function() {
            return new Promise((resolve,reject)=>{
              var self = this;
              this.timeout = setTimeout(()=>{ 
                self.loading=null; self.error='Request timed out'}
                , 20000);
            this.loading = 'loading'
            fetch(this.$api + '/services', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                // body: JSON.stringify({}),
                })
                .then(res => res.json())
                .then(data => {
                    clearTimeout(this.timeout)
                    this.loading = null;
                    console.log('mocks',data)
                    this.services = data
                    resolve(data)
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
            })
          }
      }
  }
</script>

<style scoped>
.main{
}
.mocks_menu{
}
.menu_button{
  cursor: pointer
}
.menu_button:hover{
  background: yellow;
}

</style>
