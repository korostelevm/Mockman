<template>
<div>
  <div>
                    <div class='float-right'>
                      <NewMockModal
                        :service="service"
                        :path="path"
                        :method="method"
                        v-on:save="load"
                      />
                    </div>
                    <h5>Mocks</h5>
                      
                    <p>
                      Mocks are parameter sets for the api specs. <br>You can define request and response headers, parameters and body, 
                    </p>
                    </div>
                    <b-tabs  card  lazy>
                      <b-tab v-for="m in mocks" :key="m.id"
                      :title='m.name'>
                        <p>{{m.description}}</p>
                          
                        <EditMock
                          :_mock="m"
                          :service="service"
                          :path="path"
                          :method="method"
                          v-on:saved="load"
                          v-on:removed="function(){m=null; load()}"
                        />
                      </b-tab>
                    </b-tabs>
</div>
</template>

<script>

export default {
    props:['service','path','method'],
    data() {
      return {
        loading: null,
        mocks:[]
      }
    },
    mounted: function() {
      this.load();
    },
    created: function() {
    },
    methods: {
      load(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
          fetch(this.$api + '/service/'+this.service.id+'/mocks'+
                '?path=' + encodeURIComponent(this.path)+
                '&method=' + encodeURIComponent(this.method.method)
                , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                // body: JSON.stringify(this.service),
                })
                .then(res => res.json())
                .then(data => {
                    this.loading = null;
                    console.log(data)
                    this.mocks = data;
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
