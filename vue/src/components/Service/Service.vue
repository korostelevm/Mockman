<template>
<div class="mt-4">
  <div class="row">
    <div class="col">
      <div class = 'loading' v-if="loading && !error"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading</div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <h2>{{service.Service}}</h2>
    </div>
    <div class="col">
    <button class="btn btn-danger" type="button"
    v-on:click="remove"
    ><i class='fa fa-trash'></i> Delete Service</button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      {{service.description}}
    </div>
  </div>
</div>
</template>

<script>
import { EventBus } from '../../EventBus.js';
export default {
    props: ['serviceId'],
    data() {
      return {
        service:{},
        modal_open:false,
        url:null,
        error: null,
        loading: null,
        timeout:null,
        }
    },
    mounted: function() {
      this.load()
    },
    created: function() {
    },
    watch: {
      serviceId: function(){this.load()}
    },
    methods: {
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
