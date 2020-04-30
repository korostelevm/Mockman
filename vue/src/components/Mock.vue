<template>
    <div class='mocks row'>
      <div v-if="service" class='routes col-md-2'>
        <div class="list-group">
          <a href="#" class="list-group-item list-group-item-action"
            :class="{active: m == mock}"
            v-for="m of service" v-bind:key="m.mockId" v-on:click="mock=m">
            <strong>{{m.name}}</strong><br>
            {{m.method}}  {{m.path}} 
          </a>
        </div>
      </div>
      <div v-if="mock" class='col-md-6'>
        <h2>{{mock.Service}} | {{mock.name}}</h2>
        <h3>{{mock.method}}</h3>
        <button type="button" class="btn btn-danger"
        v-on:click="remove(mock)"
        >Delete</button>

        <div class='button'
        v-on:click="save(mock)"
        >Save</div> 
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
        <div class='mock_fields'>
          <div>
            <h4>Request Headers</h4>
            <codemirror
                :value="mock.requestHeaders"
                :options="cmOptions"
                @input="function(c){mock.requestHeaders = c}"
              />
          </div>
          <div>
            <h4>Response Headers</h4>
            <codemirror
                :value="mock.responseHeaders"
                :options="cmOptions"
                @input="function(c){mock.responseHeaders = c}"
              />
          </div>
          <div>
            <h4>Request Body</h4>
              <codemirror
                :value="mock.requestBody"
                :options="cmOptions"
                @input="function(c){mock.requestBody = c}"
              />
          </div>
          <div> 
            <h4>Response Body</h4>
            <codemirror
                :value="mock.responseBody"
                :options="cmOptions"
                @input="function(c){mock.responseBody = c}"
              />
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
        url:null,
        mock:null,
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
        this.loading= true;
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
                    this.loading = null;
                    console.log(data)
                    EventBus.$emit('mock_saved', data)
                    resolve(data)
                }).catch(e => {
                  this.error = e; console.error('exception:', e);
                })
          })
      },
      remove(mock){
        this.loading= true;
        return new Promise((resolve,reject)=>{
        fetch(this.$api + '/mock/'+mock.mockId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                    this.loading = null;
                    console.log(data)
                    EventBus.$emit('mock_saved', data)
                    this.mock = null;
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
}
.routes{
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
