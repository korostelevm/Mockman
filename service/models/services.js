var faker = require('faker')
var moment = require('moment')
var _ = require('lodash')
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
dynamoose.AWS.config.update({
      region: 'us-east-1'
    });

var schema = new Schema({
        "serviceId": {
            type: String,
            hashKey: true
        },
        "Service": {
            type: String,
            index: {
                global: true,
                rangeKey: 'serviceId',
                name: 'ServiceIndex',
                project: true, // ProjectionType: ALL
                throughput: 'ON_DEMAND'
            }
        },
        description:String,
    },{ 
        saveUnknown: true,
        useDocumentTypes: true,
        timestamps: true,
        throughput: 'ON_DEMAND'
    })
const Service = dynamoose.model('Service', schema)
    
const get_services = function(){
    return new Promise( async (resolve, reject)=>{
        Service.scan().exec()
        .then(function(services) {
                return resolve(services)
            }) 
    }) 
} 

const get_service = function(serviceId){
    console.log(serviceId)
    return new Promise( async (resolve, reject)=>{
        Service.get(serviceId)
        .then(function(m) {
            console.log(m)
                return resolve(m)
            })
    })
}
    
const make_service = function(service_definition){
    return new Promise( async (resolve, reject)=>{
        service_definition.serviceId = service_definition.Service
        var service = new Service(service_definition)
        service.save()
        .then(function(services) {
                return resolve(services)
            })
    })
}
 
const delete_service = function(serviceId){
    return new Promise( async (resolve, reject)=>{
        Service.delete(serviceId)
        .then(function(m) {
            console.log(m)
                return resolve(m)
        })
        return resolve({'msg':"deleted"})
    })
}

module.exports = {
    get_service,
    get_services,
    make_service,
    delete_service
}

