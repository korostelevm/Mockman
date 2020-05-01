<template>
<div class="mt-4">
<button type="button" class="btn btn-primary btn-block" data-toggle="modal" data-target="#service_edit_modal">
  New Service
</button>
<div class="modal fade" id="service_edit_modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true"
:class="{
  show: modal_open
}"
>
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Create a Service</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <div class='mocks'>
      <div v-if="service">

          <form>
            <div class="form-group">
              <label for="service_name_input">Service Name</label>
              <input type="text" class="form-control" id="service_name_input" placeholder="Name"
                v-model="service.Service"
              >
            </div>
            <div class="form-group">
              <label for="service_desc_input">Describe the Service</label>
              <textarea class="form-control" id="service_desc_input" rows="3"
              v-model="service.description"
              ></textarea>
            </div>
          </form>
      </div>
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
import { EventBus } from '../../EventBus.js';
export default {
    // props: ['service'],

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
      this.url = this.$api
    },
    created: function() {
    },
    methods: {
      save(){
        return new Promise((resolve,reject)=>{
        fetch(this.$api + '/service', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify(this.service),
                })
                .then(res => res.json())
                .then(data => {
                    clearTimeout(this.timeout)
                    this.loading = null;
                    console.log(data)
                    this.$emit('save', data)
                    $('#service_edit_modal').modal('hide')
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
