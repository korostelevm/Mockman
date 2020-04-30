<template>
    <div class='main row'>
    <div class='mocks_menu col-md-2'>
      <div
        class = 'loading'
        v-if="loading && !error"
      >
        <i class="fa fa-spinner fa-pulse fa-fw"></i> ...
      </div>
      <div
        class = 'loading'
        v-if="loading && !error"
      >
      </div>
      <div class="list-group" v-if='services'>
         <a href="#" class="list-group-item list-group-item-action"
            :class="{active: selected_service && s == selected_service[0].Service}"
            v-for="s of services" v-bind:key="s.serviceId" 
            v-on:click="select_service(s)">
          {{s.Service}}
        </a>
      </div>
    </div>
    <div class='col-md-9'>
      <Mock :service="selected_service"/>
    </div>
    <div class='col-md-1'>
    </div>
    </div>
</template>

<script>
import { EventBus } from '../EventBus.js';
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
      EventBus.$on('service_saved',this.get_services)
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
                    // Object.keys(data).forEach(k=>{
                    //   var template = _.clone(mock_boilerplate)
                    //   template.Service = k
                    //   console.log(template)
                    //   data[k].push(template)
                    // })
                    // data['New Service'] = [mock_boilerplate]
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
