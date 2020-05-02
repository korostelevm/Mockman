var faker = require('faker')
var moment = require('moment')
var _ = require('lodash')
var sha1 = require('sha1')
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
dynamoose.AWS.config.update({
      region: 'us-east-1'
    });
var slugify = require('slugify')
 
var schema = new Schema({
        "id": {
            type: String,
            hashKey: true
        },
        "serviceId": {
            type: String,
            index: {
                global: true,
                rangeKey:'path',
                name: 'serviceIdIndex',
                project: true, // ProjectionType: ALL
                throughput: 'ON_DEMAND'
            }
        }, 
        method:String,
        path:String,
    },{
        saveUnknown: true,
        useDocumentTypes: true,
        timestamps: true,
        throughput: 'ON_DEMAND',
        create:true, 
        update:true,
    })
const Model = dynamoose.model('Mock', schema)
    
const index = function(serviceId, routeId){
    logger.log(serviceId,routeId)
    return new Promise( async (resolve, reject)=>{
        Model.query('serviceId').eq(serviceId)
        .filter("routeId").eq(routeId)
        // .using('serviceIdIndex')
        .exec()
        .then(function(mocks) {
            logger.log(mocks.length)
                return resolve(mocks)
            })
    }) 
} 

const query = function(m){
    return new Promise( async (resolve, reject)=>{
        return resolve(null)
    })
}
const get = function(mockId){
    console.log(mockId)
    return new Promise( async (resolve, reject)=>{
        Model.get(mockId)
        .then(function(m) {
            console.log(m)
                return resolve(m)
            })
    })
}
    
const create = function(m){
    console.log(m)
    return new Promise( async (resolve, reject)=>{
        var mock = {
            id: [m.service.id, m.mock.name].map((d)=>{return slugify(d)}).join('/') + m.path +'['+m.method.method +']',
            serviceId: m.service.id,
            method: m.method.method,
            ...m.mock
        }
        mock = new Model(mock)
        
        // var mock = new Model({
        //     id,
        //     serviceId: m.serviceId,
        //     routeId: m.routeId,
        //     ...m.mock
        //     // mockId: '/recall',
        //     // Service: 'RememberWorkPattern',
        //     // method: 'POST',
        //     // requestHeaders: {
        //     //     'Authorization':'test',
        //     //     'Content-Type':'application/json'
        //     // },   
        //     // requestBody: JSON.stringify({
        //     //     '_datapoint':'datapointName'
        //     // }),
        //     // responseHeaders: { 
        //     //     'Content-Type':'application/json' 
        //     // },
        //     // responseBody: JSON.stringify({
        //     //     'status':'saved' 
        //     })
            
        // // })
        // // mock_definition.mockId = [mock_definition.Service, mock_definition.path].join('')
        // // mock_definition = _.mapValues(mock_definition, (v)=>{
        // //     if(typeof(v)=='object'){return JSON.stringify(v)}
        // //     return v
        // //   })
        // //   var mock = new Model(mock_definition)
        // console.log(mock)

        mock.save()
        .then(function(mocks) {
                return resolve(mocks)
            })
    })
}
 
const remove = function(mockId){
    return new Promise( async (resolve, reject)=>{
        Model.delete(mockId)
        .then(function(m) {
                logger.log(m)
                return resolve({'msg':"deleted"})
        })
    })
}

module.exports = {
    query,
    index,
    get,
    create,
    remove
}

