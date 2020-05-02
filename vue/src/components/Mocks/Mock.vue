<template>
<div class="mt-4">
  <div class="row">
    <div class="col">
      <div class = 'loading' v-if="loading && !error"><i class="fa fa-spinner fa-pulse fa-fw"></i>Loading</div>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <h2>{{mock.name}}</h2>
    </div>
    <div class="col">
    <button class="btn btn-danger btn-sm" type="button"
    v-on:click="remove"
    ><i class='fa fa-trash'></i> Delete Mock</button>
    </div>
  </div>
  <div class="row">
    <div class="col">
      {{mock.description}}
    </div>
  </div>
</div>
</template>

<script>
export default { 
    props: ['serviceId','routeId','mockId'],
    data() {
      return {
        mock:{},
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
      serviceId: function(){this.load()},
      routeId: function(){this.load()},
      mockId: function(){this.load()}
    },
    methods: {
      remove(){
        return new Promise((resolve,reject)=>{
          console.log('remove',this.mockId)
          this.loading = true;
        fetch(this.$api + '/service/'+this.serviceId+'/routes/'+this.routeId+'/mocks/'+this.mockId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                  this.mock = data
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
        fetch(this.$api + '/service/'+this.serviceId+'/routes/'+this.routeId+'/mocks/'+this.mockId, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                })
                .then(res => res.json())
                .then(data => {
                    this.loading = null;
                    console.log(data)
                    this.mock = data
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
.mocks{
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
