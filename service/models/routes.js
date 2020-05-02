var faker = require('faker')
var moment = require('moment')
var _ = require('lodash')
var slugify = require('slugify')
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
dynamoose.AWS.config.update({
      region: 'us-east-1'
    });
var models = require('../models/models')

var schema = new Schema({
        "id": {
            type: String,
            hashKey: true
        },
        "serviceId": {
            type: String,
            index: {
                global: true,
                name: 'serviceIdIndex',
                project: true, // ProjectionType: ALL
                throughput: 'ON_DEMAND'
            }
        },
        name:String,
        description:String,
    },{ 
        saveUnknown: true,
        useDocumentTypes: true,
        timestamps: true,
        throughput: 'ON_DEMAND',
        create:true, 
        update:true,
    })
const Model = dynamoose.model('Route', schema)
    
const index = function(serviceId){
    return new Promise( async (resolve, reject)=>{
        Model.query({serviceId:serviceId}).using("serviceIdIndex").exec()
        .then(function(services) {
                return resolve(services)
            }) 
    }) 
} 

const get = function(id){
    return new Promise( async (resolve, reject)=>{
        Model.get(id)
        .then(function(m) {
                return resolve(m)
            })
    })
}
    
const create = function(route){
    return new Promise( async (resolve, reject)=>{
        route.id = slugify(route.name,{
            replacement: '-',
            lower: false,
            strict: false,
        })
        route = new Model(route)
        route.save()
        .then(function(r) {
            return resolve(r)
        })
    })
}
 
const remove = function(id){
    return new Promise( async (resolve, reject)=>{
        Model.delete(id)
        .then(function(m) {
            // models.routes.remove()
                return resolve(m)
        })
    })
}

module.exports = {
    get,
    index,
    create,
    remove
}

