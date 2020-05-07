<template>
<div class="mt-4">
  <div class="row">
    <div class="col-md-5 yaml_editor">
      <div class="row">
    <div class="col">
      <h2>{{service.spec ? service.spec.info.title : service.name}}</h2> 
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
        ><i class='fa fa-trash'></i> Delete App</button>
      </div>
    </div>
  </div>
      <div class="row">
    <div class="col">
      {{service.spec ? service.spec.info.description : service.description}}
    </div>
  </div>
  <hr>



      
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
  <div class="col-md-7"
  v-if="service.spec"
  >
    <b-tabs content-class="mt-3">
      <b-tab lazy
      v-for="(path,k) of Object.keys(service.spec.paths)" :key="k"
       :title="path" >
          <div>
            <b-card no-body>
              <b-tabs pills card lazy >
                <b-tab v-for="(method,m) in service.spec.paths[path]" :key="m"
                  :title="m" >
                  <b-card-text>
                    <h5>Summary</h5>
                    <div class='ml-3'>
                      <p>{{method.summary}}</p>
                    </div>
                    <div v-if="method.parameters">
                      <div v-if="method.parameters.filter((p)=>{return p.in =='query'}).length">
                        <h5>Query parmeters</h5>
                        <div class='ml-3'>
                          <p v-for="param of method.parameters.filter((p)=>{return p.in =='query'})" :key="param.name"
                          ><b-badge>{{(param.schema && param.schema.type) ? param.schema.type : 'string'}}</b-badge> &nbsp;<strong>{{param.name}}</strong>
                            &nbsp;{{param.description ? ': '+param.description : ''}}</p>
                        </div>
                      </div>
                      <div v-if="method.parameters.filter((p)=>{return p.in =='body'}).length">
                        <h5>Body parmeters</h5>
                        <div class='ml-3'>
                          <p v-for="param of method.parameters.filter((p)=>{return p.in =='body'})" :key="param.name"
                          ><b-badge>{{(param.schema && param.schema.type) ? param.schema.type : 'string'}}</b-badge> &nbsp;<strong>{{param.name}}</strong>
                            &nbsp;{{param.description ? ': '+param.description : ''}}</p>
                        </div>
                      </div>
                      <div v-if="method.parameters.filter((p)=>{return p.in =='path'}).length">
                        <h5>Path parmeters</h5>
                        <div class='ml-3'>
                          <p v-for="param of method.parameters.filter((p)=>{return p.in =='path'})" :key="param.name"
                          ><b-badge>{{(param.schema && param.schema.type) ? param.schema.type : 'string'}}</b-badge> &nbsp;<strong>{{param.name}}</strong>
                            &nbsp;{{param.description ? ': '+param.description : ''}}</p>
                        </div>
                      </div>
                      <div v-if="method.requestBody && method.requestBody.content['application/json'] && method.requestBody.content['application/json'].schema">
                        <h5>Request Body Schema &nbsp;<b-badge>{{ Object.keys(method.requestBody.content)[0] }}</b-badge> </h5>
                        <div class='ml-3'>
                          <h6><b-badge>{{method.requestBody.content['application/json'].schema.type}}</b-badge></h6>
                          <div v-if="method.requestBody.content['application/json'].schema.type =='object' &&  method.requestBody.content['application/json'].schema.properties">
                            <tree-view :data="method.requestBody.content['application/json'].schema.properties" :options="{maxDepth:1,  rootObjectKey: 'properties'}"></tree-view>
                          </div>
                        </div>
                      </div>
                    </div>
                    <hr>
                    <Mocks
                        :service="service"
                        :path="path"
                        :method="{method:m, ...method}"
                    />

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
            tabSize: 2,
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
.yaml_editor .CodeMirror {
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
