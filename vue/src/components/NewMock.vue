<template>
<div class="mt-4">
<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#exampleModal">
  New Mock
</button>
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
:class="{
  show: modal_open
}"
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div class='mocks'>
      <div v-if="service" class='routes'>
        <div class='button' v-for="m of service" v-bind:key="m.mockId" v-on:click="mock=m">
          <strong>{{m.name}}</strong><br>
          {{m.method}}  {{m.path}} 
          
        </div>
      </div>
      <div v-if="mock">
        <h2>{{mock.Service}} | {{mock.name}}</h2>
        <h3>{{mock.method}}</h3>
          <input v-model="mock.Service" placeholder="Service">
          <input v-model="mock.name" placeholder="Mock name">
          <input v-model="mock.path" placeholder="Mock path">
          <select v-model="mock.method">
            <option disabled value="">Method</option>
            <option>POST</option>
            <option>GET</option>
            <option>PUT</option>
            <option>DELETE</option>
          </select>
        <div>mock url: {{url}}/server/{{mock.mockId}}</div>
      </div>
    </div>
      
      
      
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary"
        v-on:click="save(mock)"
        >Save changes</button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
import Vue from 'vue'
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/vue/vue.js'
import 'codemirror/theme/monokai.css'

import { EventBus } from '../EventBus.js';
export default {
    name: 'Mock',
    props: ['service'],

    data() {
      return {
        modal_open:false,
        url:null,
        mock:{
            Service:'New Service',
            method:'',
            name:'New Mock',
            path:'',
            requestBody:'',
            requestHeaders:'',
            responseBody:'',
            responseHeaders:'',
        },
        error: null,
        loading: null,
        timeout:null,
         cmOptions: {
                tabSize: 4,
            styleActiveLine: true,
            lineNumbers: true,
            mode: 'application/json',
            theme: "monokai"
        }
      }
    },
    watch: {
      service:function(s){
        this.mock = null
      }
    },
    components:{
      codemirror
    },
    mounted: function() {
      this.url = this.$api
    },
    created: function() {
    },
    methods: {
      save(mock){
        return new Promise((resolve,reject)=>{
        fetch(this.$api + '/mock', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify(mock),
                })
                .then(res => res.json())
                .then(data => {
                    clearTimeout(this.timeout)
                    this.loading = null;
                    console.log(data)
                    EventBus.$emit('mock_saved', data)
                    $('#exampleModal').modal('hide')
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
.mocks{
  margin:20px;
}
.routes{
  margin:20px;
}
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
