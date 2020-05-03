<template>
<div>
    <h5>Endpoint</h5>
    <b-alert variant="success" show>
      &nbsp; {{$api}}/server/{{mock.serviceId}}/{{encodeURIComponent(mock.name)}}{{mock.path}}{{mock.url_params}}
    </b-alert>
    <hr>
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
        ><i class='fa fa-trash'></i> Delete Mock</button>
      </div>


    <h5>Request</h5>
    <div class="row">
        <div class="col-md-6">
            Request Parameters
            <codemirror
            :value="mock.request_params"
            :options="cmOptions"
            @input="input_request_params"
            />
        </div>
        <div class="col-md-6">
            Request Headers
            <codemirror
            :value="mock.request_headers"
            :options="cmOptions"
            @input="input_request_headers"
            />
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            Request Body
            <codemirror
            :value="mock.request_body"
            :options="cmOptions"
            @input="input_request_body"
            />
        </div>
    </div>
  <hr>
    <h5>Response</h5>
    <div class="row mt-3">
        <div class="col">
            Response Headers
            <codemirror
            :value="mock.response_headers"
            :options="cmOptions"
            @input="input_response_headers"
            />
        </div>
    </div>
    
    <div class="row mt-3">  
        <div class="col">
            Response Body
            <codemirror
            :value="mock.response_body"
            :options="cmOptions"
            @input="input_response_body"
            />
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/mode/yaml/yaml'
import 'codemirror/theme/monokai.css'

export default {
    props:['path','method','service','method',"_mock"],
    data() {
      var mock_saved = _.clone(this._mock)
      var mock = _.clone(this._mock)
      if(this.method.parameters){
        var req_params = _.groupBy(this.method.parameters, 'name')
        var req_params = _.mapValues(req_params,(v)=>{
          try{
            return v[0].schema.type
          }catch(e){
            return 'string'
          }
        })
        if(!mock.query){
          mock.request_params = JSON.stringify(req_params,null,2)
          mock.query = req_params
        }
        mock.url_params ='?'+ Object.keys(mock.query)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(mock.query[k]))
          .join('&')
        
      }

      if(!mock.request_headers){
        mock.request_headers = JSON.stringify({
          "Content-Type":"application/json"
        },null,2)
      }
      
      return {
        saved:true,
        mock_saved:mock_saved,
        mock:mock,
        loading: null,
        cmOptions: {
            tabSize: 2,
            styleActiveLine: true,
            lineNumbers: true,
            mode: 'application/json',
            theme: "monokai"
        }
      }
    },
    watch:{
    },
    components:{
      codemirror
    },
    mounted: function() {
    },
    created: function() {
    },
    methods: {
      input_response_body(c){
        if(this._mock.response_headers !== c){this.saved = false}
        this.mock.response_body = c
        this.validate()
      },
      input_response_headers(c){
        this.mock.response_headers = c
        this.validate()
      },
      input_request_body(c){
        this.mock.request_body = c
        this.validate()
      },
      input_request_headers(c){
        this.mock.request_headers = c
        this.validate()
      },
      input_request_params(c){
        this.mock.request_params = c
        this.mock.query = JSON.parse(c)
        var url_params = '?'+Object.keys(this.mock.query)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(this.mock.query[k]))
          .join('&')
        Vue.set(this.mock,'url_params',url_params,true)
        this.validate()
      },
      validate(){
        if( this.mock.request_headers != this.mock_saved.request_headers ||
        this.mock.request_params != this.mock_saved.request_params ||
        this.mock.request_body != this.mock_saved.request_body ||
        this.mock.response_headers != this.mock_saved.response_headers ||
        this.mock.response_body != this.mock_saved.response_body){
          this.saved = false
        }else{
          this.saved = true
        }
        
      },
      update(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
          fetch(this.$api + '/mock/'+encodeURIComponent(this.mock.id)
                , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify(this.mock),
                })
                .then(res => res.json())
                .then(data => {
                    this.loading=false;
                    this.saved=true;
                    this.mock_saved=_.clone(this.mock);
                    this.$emit('saved', this.mock)
                    console.log('saved mock',data)
                    resolve(data)
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
          })
        },
      remove(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
          fetch(this.$api + '/mock/'+encodeURIComponent(this.mock.id)
                , {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                    this.loading=false;
                    this.$emit('removed')
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
