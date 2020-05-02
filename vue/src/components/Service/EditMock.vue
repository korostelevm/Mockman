<template>
<div>
    <h5>Request</h5>
    <div class="row">
        <div class="col-md-6">
            Request Parameters
            <codemirror
            :value="mock.request_params"
            :options="cmOptions"
            @input="function(c){mock.request_params = c}"
            />
        </div>
        <div class="col-md-6">
            Response Headers
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
    props:['path','method'],
    data() {
      return {
        loading: null,
        mock:{},
        cmOptions: {
            tabSize: 2,
            styleActiveLine: true,
            lineNumbers: true,
            mode: 'application/json',
            theme: "monokai"
        }
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
      }
  }
</script>

<style scoped>
</style>
