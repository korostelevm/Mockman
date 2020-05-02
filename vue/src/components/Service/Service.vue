<template>
<div class="mt-4">
  <div class="row">
    <div class="col">
      <h2>{{service.name}}</h2> 
    </div> <span class = 'loading' v-if="loading && !error"><i class="fa fa-spinner fa-pulse fa-fw"></i></span>
    <div class="col">
      
      <div class="btn-group float-right" role="group">
        <button class="btn btn-sm"
          :class="{
            'btn-success':saved,
            'btn-warning':!saved,
            }"
         type="button"
        v-on:click="update"
        ><i class='fa fa-check'></i> Save</button>
        <button class="btn btn-danger btn-sm" type="button"
        v-on:click="remove"
        ><i class='fa fa-trash'></i> Delete Service</button>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      {{service.description}}
    </div>
  </div>
  <hr>
  <div class="row">
    <div class="col-md-5">
  <h4>Api Spec</h4>
  <codemirror
      :value="service.spec_yaml"
      :options="cmOptions"
      @input="spec_code_input"
    />
    <div 
    v-if='!valid_yaml'
    class="alert alert-danger" role="alert">
      Invalid yaml
    </div>
  </div>
  <hr>
  <div class="col"
  v-if="service.spec"
  >
    <b-tabs content-class="mt-3">
      <b-tab
      v-for="(path,k) of Object.keys(service.spec.paths)" :key="k"
       :title="path" >
          <div>
            <b-card no-body>
              <b-tabs pills card vertical>
                <b-tab v-for="(method,m) of Object.keys(service.spec.paths[path])" :key="m"
                  :title="method.toUpperCase()" >
                  <b-card-text>
                    
                    <p>{{service.spec.paths[path][method].requestBody}}</p>
                    <p>{{service.spec.paths[path][method].summary}}</p>
                    
                  </b-card-text>
                </b-tab>
              </b-tabs>
            </b-card>
          </div>
       </b-tab>
    </b-tabs>
  </div>
  </div>
 
  
 <!-- <div 
 v-if="service.spec"
 class="row mt-3 ">
   <div class='col'>
     <ul class="nav nav-tabs" id="myTab" role="tablist">
  <li 
    v-for="(path,k) of Object.keys(service.spec.paths)" :key="k"
    class="nav-item">
    <a class="nav-link" :id="path+'-tab'" data-toggle="tab"
     :href="'#'+path" role="tab" :aria-controls="path"
    aria-selected="true">{{path}}</a>
  </li>
</ul>
<div class="tab-content">
  <div
    v-for="(path,k) of Object.keys(service.spec.paths)" :key="k"
    class="tab-pane fade show active" :id="path" role="tabpanel" :aria-labelledby="path+'-tab'">
    summary: {{service.spec.paths[path].summary}}
    </div>
    </div> -->
  <!-- <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div> -->
  <!-- <div class="row mt-3 ">
      <div class="col">
        <h4>Routes</h4>
      </div>
      <div class="col">
        <RouteModal 
        :serviceId="serviceId"
        v-on:save="function(s){route_list_key+=1}"
        />
      </div>
  </div>
  <div class="row">
      <div class="col">
        <RouteList :serviceId="serviceId" :key="route_list_key"
        v-on:selected_route="function(r){
          selected_route = r.id}"
         />
      </div>
  </div>
  <hr>
    <Route 
    v-if="selected_route"
    :serviceId="serviceId" :routeId="selected_route"
    v-on:remove="function(s){selected_route=null; route_list_key+=1}"
    /> -->
</div>
</template>

<script>
import { EventBus } from '../../EventBus.js';
import Vue from 'vue'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/theme/monokai.css'
var yaml = require('js-yaml');


export default { 
    props: ['serviceId'],
    data() {
      return {
        saved:true,
        valid_yaml:true,
        service_saved:{},
        service:{},
        modal_open:false,
        url:null,
        error: null,
        loading: null,
        timeout:null,
        route_list_key:0,
        selected_route:null,
        cmOptions: {
                tabSize: 4,
            styleActiveLine: true,
            lineNumbers: true,
            mode: 'text/x-yaml',
            theme: "monokai"
        }
      }
    },
    components:{
      codemirror
    },
    mounted: function() {
      this.load()
    },
    created: function() {
    },
    watch: {
      serviceId: function(){this.load()},
      service: {
        deep:true,
        handler:function(){ 
        }
      }
    },
    methods: {
      spec_code_input(c){
        this.valid_yaml = true;
        this.saved = this.service_saved.spec_yaml == c
        this.service.spec_yaml = c
        try{
          var spec = yaml.load(c)
          this.service.spec = spec
          console.log(spec)
        }catch(e){
          if(e.name == 'YAMLException'){
            this.valid_yaml = false;
            return
          }
          throw e
        }
      },
      update(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
        fetch(this.$api + '/service/'+this.serviceId, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify(this.service),
                })
                .then(res => res.json())
                .then(data => {
                  this.saved = true;
                  this.service_saved = _.clone(this.service)
                  this.loading = false;
                    resolve(data)
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
          })
    },
      remove(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
        fetch(this.$api + '/service/'+this.serviceId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                // body: JSON.stringify(this.service),
                })
                .then(res => res.json())
                .then(data => {
                    this.service = data
                    resolve(data)
                    this.$emit('remove')
                    this.loading = false;
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
          })
    },
      load(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
        fetch(this.$api + '/service/'+this.serviceId, {
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
                    this.service_saved = _.clone(data)
                    this.service = data
                    resolve(data)
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
          })
    }
    }
  }
</script>

<style>
.CodeMirror {
  border: 1px solid #eee;
  /* height: auto; */
  overflow-y: hidden;
  overflow-x: auto;
  height: 70vh;
}

</style>
<style scoped>

.vue-codemirror {
  border: 1px solid #eee;
  height: auto;
}
.mock_fields{
  width:50vw;
  display: grid;
  grid-template-columns: 50% 50%;
}
</style>
