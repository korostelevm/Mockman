<template>
<div>
    <b-button size="sm" v-b-modal="'new_mock_' + path">Create a mock</b-button>
    <b-modal hide-backdrop
     content-class="shadow"
    :id="'new_mock_' + path" title="Create a Mock">
        <div class="row">
            <div class="col-md-5">
                <h4>Request Headers</h4>
                <codemirror
                :value="mock"
                :options="cmOptions"
                @input="function(c){mock.request_headers = c}"
                />
            </div>
            <div class="col-md-5">
            </div>
        </div>

    </b-modal>
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
