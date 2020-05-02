<template>
    <div class='main row'>
    <div class='mocks_menu col-md-2'>
      <div class="list-group" v-if='routes'>
         <a href="#" class="list-group-item list-group-item-action"
            :class="{active: selected_route && s == selected_route}"
            v-for="s of routes" v-bind:key="s.id" 
            v-on:click="select_route(s)">
          {{s.name}}
        </a>
      </div>
    </div>
    <div class='col-md-9'>
      <!-- <Route v-if="selected_route" :routeId="selected_route.routeId"
      v-on:remove="function(){selected_route=null; get_routes()}"
      v-on:save="get_routes"
       /> -->
    </div>
    </div>
</template>

<script>
export default {
    props:['serviceId'],
    data() {
      return {
        error: null,
        loading: null,
        timeout:null,
        routes: null,
        selected_route: null,
      }
    },
    mounted: function() {
      this.load()
    },
    created: function() {
    },
    // watch: {
    //   key: function(){this.load()}
    // },
    methods: {
        select_route: function(route){
          this.selected_route = route
          console.log('route',route)
          this.$emit('selected_route',route)
        },
        load: function() {
            return new Promise((resolve,reject)=>{
              var self = this;
              this.timeout = setTimeout(()=>{ 
                self.loading=null; self.error='Request timed out'}
                , 20000);
            this.loading = 'loading'
            fetch(this.$api +'/service/'+this.serviceId + '/routes', {
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
                    this.routes = data
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
