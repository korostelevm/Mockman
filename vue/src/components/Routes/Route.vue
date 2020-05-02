<template>
<div class="mt-4">
  <div class="row">
    <div class="col">
      <div class = 'loading' v-if="loading && !error"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading</div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <h2>{{route.name}}</h2>
    </div>
    <div class="col">
    <button class="btn btn-danger btn-sm" type="button"
    v-on:click="remove"
    ><i class='fa fa-trash'></i> Delete Route</button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      {{route.description}}
    </div>
  </div>
  <hr>
  <div class="row mt-3 ">
      <div class="col">
        <h4>Mocks</h4>
      </div>
      <div class="col">
        <MockModal
        :serviceId="serviceId"
        :routeId="routeId"
        v-on:save="function(s){mock_list_key+=1}"
        />
      </div>
  </div>

  <div class="row">
    <div class="col">
      <MockList 
      :key="mock_list_key"
      :serviceId="serviceId"
      :routeId="routeId"
      v-on:selected_mock="function(r){
          selected_mock = r.id}"
      />
    </div>
  </div>
  <div class="row">
    <div class="col">
      <Mock 
        v-if="selected_mock"
        :serviceId="serviceId" :routeId="routeId" :mockId="selected_mock"
        v-on:remove="function(s){selected_mock=null; mock_list_key+=1}"
        />
    </div>
  </div>
</div>
</template>

<script>
export default { 
    props: ['serviceId','routeId'],
    data() {
      return {
        route:{},
        modal_open:false,
        url:null,
        error: null,
        loading: null,
        timeout:null,
        mock_list_key:0,
        selected_mock:null
        }
    },
    mounted: function() {
      this.load()
    },
    created: function() {
    },
    watch: {
      serviceId: function(){this.selected_mock=null;  this.load()},
      routeId: function(){this.selected_mock=null; this.load()}
    },
    methods: {
      remove(){
        return new Promise((resolve,reject)=>{
          this.loading = true;
        fetch(this.$api + '/service/'+this.serviceId+'/routes/'+this.routeId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                  this.route = data
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
        fetch(this.$api + '/service/'+this.serviceId+'/routes/'+this.routeId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                    this.loading = null;
                    this.route = data
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
