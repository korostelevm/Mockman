var faker = require('faker')
var moment = require('moment')
var _ = require('lodash')
const dynamoose = require('dynamoose');
const Schema = dynamoose.Schema;
dynamoose.AWS.config.update({
      region: 'us-east-1'
    });

var schema = new Schema({
        "mockId": {
            type: String,
            hashKey: true
        },
        "Service": {
            type: String,
            index: {
                global: true,
                rangeKey: 'mockId',
                name: 'ServiceIndex',
                project: true, // ProjectionType: ALL
                throughput: 'ON_DEMAND'
            }
        },
        requestHeaders:String,
        requestBody:String,
        responseHeaders:String,
        responseBody:String,
    },{
        saveUnknown: true,
        useDocumentTypes: true,
        timestamps: true,
        throughput: 'ON_DEMAND'
    })
const Mock = dynamoose.model('Mock', schema)
    
const get_mocks = function(){
    return new Promise( async (resolve, reject)=>{
        Mock.scan().exec()
        .then(function(mocks) {
                return resolve(mocks)
            })
    }) 
} 

const query_mock = function(m){
    return new Promise( async (resolve, reject)=>{
        return resolve(null)
    })
}
const get_mock = function(mockId){
    console.log(mockId)
    return new Promise( async (resolve, reject)=>{
        Mock.get(mockId)
        .then(function(m) {
            console.log(m)
                return resolve(m)
            })
    })
}
    
const make_mock = function(mock_definition){
    return new Promise( async (resolve, reject)=>{
        // var mock = new Mock({
        //     mockId: '/recall',
        //     Service: 'RememberWorkPattern',
        //     method: 'POST',
        //     requestHeaders: {
        //         'Authorization':'test',
        //         'Content-Type':'application/json'
        //     },   
        //     requestBody: JSON.stringify({
        //         '_datapoint':'datapointName'
        //     }),
        //     responseHeaders: { 
        //         'Content-Type':'application/json' 
        //     },
        //     responseBody: JSON.stringify({
        //         'status':'saved' 
        //     }),
            
        // })
        mock_definition.mockId = [mock_definition.Service, mock_definition.path].join('')
        mock_definition = _.mapValues(mock_definition, (v)=>{
            if(typeof(v)=='object'){return JSON.stringify(v)}
            return v
          })
          var mock = new Mock(mock_definition)
          console.log(mock)

        mock.save()
        .then(function(mocks) {
                return resolve(mocks)
            })
    })
}
 
const delete_mock = function(mockId){
    return new Promise( async (resolve, reject)=>{
        Mock.delete(mockId)
        .then(function(m) {
            console.log(m)
                return resolve(m)
        })
        return resolve({'msg':"deleted"})
    })
}

module.exports = {
    query_mock,
    get_mocks,
    get_mock,
    make_mock,
    delete_mock
}

