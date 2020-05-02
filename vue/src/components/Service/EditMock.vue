<template>
<div>
    <h5>Endpoint</h5>
    <b-alert variant="success" show>
      &nbsp; {{$api}}/server/{{mock.serviceId}}/{{encodeURIComponent(mock.name)}}{{mock.path}}{{mock.url_params}}
    </b-alert>
    <hr>
    <div class='float-right'>
      <b-button size="sm" 
      variant="success"
      >
        Save Mock</b-button>
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
            @input="function(c){mock.request_headers = c}"
            />
        </div>
    </div>
    <div class="row mt-3">
        <div class="col">
            Request Body
            <codemirror
            :value="mock.request_body"
            :options="cmOptions"
            @input="function(c){mock.request_body = c}"
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
            @input="function(c){mock.response_headers = c}"
            />
        </div>
    </div>
    
    <div class="row mt-3">  
        <div class="col">
            Response Body
            <codemirror
            :value="mock.response_body"
            :options="cmOptions"
            @input="function(c){mock.response_body = c}"
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
      'mock.request_params':function(c){
        console.log(c)
      }
    },
    components:{
      codemirror
    },
    mounted: function() {
     
    },
    created: function() {
    },
    methods: {
      input_request_params(c){
        this.mock.request_params = c
        this.mock.query = JSON.parse(c)
        var url_params = '?'+Object.keys(this.mock.query)
          .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(this.mock.query[k]))
          .join('&')
        Vue.set(this.mock,'url_params',url_params,true)
        console.log(url_params)
      }
    }
  }
</script>

<style scoped>
</style>
