<template>
    <div class='main row'>
    <div class='col'>
      {{serviceId}}{{routeId}}
      <div class="list-group" v-if='mocks'>
         <a href="#" class="list-group-item list-group-item-action"
            :class="{active: selected_mock && m == selected_mock}"
            v-for="m of mocks" v-bind:key="m.id" 
            v-on:click="select_mock(m)">
          {{m.name}}
        </a>
      </div>
    </div>
    </div>
</template>

<script>
export default {
    props:['serviceId','routeId'],
    data() {
      return {
        error: null,
        loading: null,
        timeout:null,
        mocks: null,
        selected_mock: null,
      }
    },
    mounted: function() {
      this.load()
    },
    created: function() {
    },
    watch: {
      serviceId: function(){this.load()},
      routeId: function(){this.load()}
    },
    methods: {
        select_mock: function(mock){
          this.selected_mock = mock
          console.log('mock',mock)
          this.$emit('selected_mock',mock)
        },
        load: function() {
            return new Promise((resolve,reject)=>{
              var self = this;
              this.timeout = setTimeout(()=>{ 
                self.loading=null; self.error='Request timed out'}
                , 20000);
            this.loading = 'loading'
            fetch(this.$api +'/service/'+this.serviceId + '/routes/'+this.routeId+'/mocks', {
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
                    this.mocks = data
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

</style>
