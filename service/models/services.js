var faker = require('faker')
var moment = require('moment')
var _ = require('lodash')
var utils = require('./utils')
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
dynamoose.AWS.config.update({
      region: 'us-east-1'
    });

var schema = new Schema({
        "id": {
            type: String,
            hashKey: true
        },
        "name": {
            type: String,
            index: {
                global: true,
                name: 'nameIndex',
                project: true, // ProjectionType: ALL
                throughput: 'ON_DEMAND'
            }
        },
        spec_yaml:String, 
        // spec:{
        //     type:Object,
        //     // "set": (value) => {return JSON.stringify(value)} ,
        //     // "get": (value) => {return JSON.parse(value)} 
        // },
        description:String,
    },{ 
        saveUnknown: true,
        useDocumentTypes: true,
        timestamps: true,
        create:true, 
        update:true,
        throughput: 'ON_DEMAND'
    })
const Service = dynamoose.model('Service', schema)
    
const index = function(){
    return new Promise( async (resolve, reject)=>{
        Service.scan().exec()
        .then(function(services) {
                services = _.sortBy(services, 'name')
                return resolve(services)
            }) 
    }) 
} 

const get = function(id){
    return new Promise( async (resolve, reject)=>{
        Service.get(id)
        .then(function(m) {
                return resolve(m)
            })
    })
}

    
const update = function(service_definition){
    return new Promise( async (resolve, reject)=>{
        // var service = new Service(service_definition)
        
        Service.update({id:service_definition.name},{
            spec: utils.clean_object(service_definition.spec),
            spec_yaml:service_definition.spec_yaml,
        })
        .then(function(services) {
                return resolve(services)
            })
    })
}
const create = function(service_definition){
    return new Promise( async (resolve, reject)=>{
        service_definition.id = service_definition.name
        var service = new Service(service_definition)
        service.save()
        .then(function(services) {
                return resolve(services)
            })
    })
}
 
const remove = function(id){
    return new Promise( async (resolve, reject)=>{
        logger.log(id)
        Service.delete(id)
        .then(function(m) {
            console.log(m)
                return resolve(m)
        })
    })
}

module.exports = {
    update,
    get,
    index,
    create,
    remove
}

