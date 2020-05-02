<template>
<div>
    <b-button size="sm" v-b-modal="'new_mock_' + path">Create a mock</b-button>
    <b-modal 
    @ok="save"
    hide-backdrop 
    ok-title="Save"
     content-class="shadow"
    :id="'new_mock_' + path" title="Create a Mock">
          <b-form>
            <b-form-group label="Mock Name:" label-for="mock_name">
              <b-form-input
                id="mock_name"
                v-model="mock.name"
                required
                placeholder="Name the mock"
              ></b-form-input>
            </b-form-group>
            <b-form-group label="Mock Purpose:" label-for="mock_desc">
              <b-form-input
                id="mock_desc"
                v-model="mock.description"
                required
                placeholder="Whats the mock for?"
              ></b-form-input>
            </b-form-group>
          </b-form>
          
    </b-modal>
</div>
</template>

<script>

export default {
    props:['service','path','method'],
    data() {
      return {
        loading: null,
        mock:{}
      }
    },
    mounted: function() {
    },
    created: function() {
    },
    methods: {
      save(e){
        e.preventDefault()
        return new Promise((resolve,reject)=>{
        this.loading=true;
        fetch(this.$api + '/mock', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.get_auth_header()
                },
                body: JSON.stringify({
                    service:this.service,
                    path: this.path,
                    method:this.method,
                    mock: this.mock
                  }),
                })
                .then(res => res.json())
                .then(data => {
                    this.$emit('save', data)
                    this.$bvModal.hide('new_mock_' + this.path)
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
</style>
