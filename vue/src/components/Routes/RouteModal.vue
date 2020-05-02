<template>
<div class='d-inline'>
<button type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#route_edit_modal">
  New Route
</button>
<div class="modal fade" id="route_edit_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
:class="{
  show: modal_open
}"
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Create a Route</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div v-if="route">
          <form>
            <div class="form-group">
              <label for="route_name_input">Route Name</label>
              <input type="text" class="form-control" id="route_name_input" placeholder="Name"
                v-model="route.name"
              >
            </div>
            <div class="form-group">
              <label for="route_desc_input">Describe the Route</label>
              <textarea class="form-control" id="route_desc_input" rows="3"
              v-model="route.description"
              ></textarea>
            </div>
          </form>
      </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" class="btn btn-primary"
        v-on:click="save"
        >Save changes</button>
      </div>
    </div>
  </div>
</div>
</div>
</template>

<script>
export default {
    props: ['serviceId'],
    data() {
      return {
        route:{},
        modal_open:false,
        url:null,
        error: null,
        loading: null,
        timeout:null,
        }
    },
    mounted: function() {
      this.url = this.$api
    },
    created: function() {
    },
    methods: {
      save(){
        return new Promise((resolve,reject)=>{
        fetch(this.$api + '/service/'+this.serviceId+'/routes', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify(this.route),
                })
                .then(res => res.json())
                .then(data => {
                    clearTimeout(this.timeout)
                    this.loading = null;
                    console.log(data)
                    this.$emit('save', data)
                    $('#route_edit_modal').modal('hide')
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
