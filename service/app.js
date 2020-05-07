'use strict'
global.logger = require('tracer').console({
  format: '<{{title}}> (in {{file}}:{{line}}) {{message}}',
  error:
          '<{{title}}> (in {{file}}:{{line}}) {{message}}\nCall Stack:\n{{stack}}' // error format
});

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const compression = require('compression')
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')
const app = express()
var slugify = require('slugify')
const router = express.Router()
var AWSXRay = require('aws-xray-sdk');
app.use(AWSXRay.express.openSegment('Mocker'));
var _ = require('lodash')
var fs = require('fs')
var models = require('./models/models')


router.use(compression())
router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(awsServerlessExpressMiddleware.eventContext())

app.use('/server', async (req, res) => {
  
  
  var mock_response = await models.mocks.serve(req)
  if(!mock_response){
    return res.status(404).send('No matching mock found')
  }

  logger.log(mock_response)
  Object.keys(mock_response.response_headers).map((k)=>{
    res.header(k,mock_response.response_headers[k])
  })
  res.header('x-mock-name', mock_response.name)
  res.header('x-mock-description', mock_response.description)
  res.header('x-mock-created', mock_response.createdAt)
  res.header('x-mock-updated', mock_response.updatedAt)
  res.send(mock_response.response_body)
})

router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})



// router.get('/mocks', async (req, res) => {
//   var mocks = await models.mocks.get_mocks()
//   mocks = mocks.map(m=>{
//     m = _.mapValues(m.originalItem(), (v)=>{
//       if(typeof(v)=='object'){return JSON.stringify(v)}
//       return v
//     })
//     return m
//   })
//   mocks = _.groupBy(mocks,'Service')
//   res.json(mocks)
// })

// router.get('/mock/:mockId', async (req, res) => { 
//   var res = await models.mocks.get_mock(req.params.mockId)
//   res.json(res)
// })

// router.put('/mock', async (req, res) => {
//   logger.log(req.body.mockId)
//   var saved = await models.mocks.make_mock(req.body)
//   res.json(saved)
// })

// router.delete('/mock/:mockId', async (req, res) => {
//   var r = await models.mocks.delete_mock({
//     mockId: req.params.mockId
//   })
//   res.json(r)
// })


// servuces

router.get('/services', async (req, res) => {
  var services = await models.services.index()
  res.json(services)
})
 
router.get('/service/:serviceId', async (req, res) => { 
  var s = await models.services.get(req.params.serviceId)
  res.json(s) 
})

router.post('/service/:serviceId', async (req, res) => {
  var saved = await models.services.update(req.body)
  res.json(saved)
})
 
router.put('/service', async (req, res) => {
  var saved = await models.services.create(req.body)
  res.json(saved)
})
 
router.delete('/service/:serviceId', async (req, res) => {
  // delete service
  var r = await models.services.remove(req.params.serviceId)
  // get and delete all the sercvices mocks
  var mocks = await models.mocks.service_index(req.params.serviceId)
  await Promise.all(mocks.map(m=>{
    m.delete()
  }))
  res.json(r)
}) 

// mocks
router.get('/service/:serviceId/mocks', async (req, res) => {
  logger.log(req.query)
  var mocks;
  if(req.query){
    mocks = await models.mocks.index(req.params.serviceId, req.query.path, req.query.method)
  }else{
    mocks = await models.mocks.service_index(req.params.serviceId)
  }

  res.json(mocks)
})
router.put('/mock', async (req, res) => {
  var saved = await models.mocks.create(req.body)
  res.json(saved)
})
router.post('/mock/:mockId', async (req, res) => {
  var saved = await models.mocks.update(req.params.mockId, req.body)
  res.json(saved)
})
router.delete('/mock/:mockId', async (req, res) => {
  var deleted = await models.mocks.remove(req.params.mockId)
  res.json(deleted)
})

// // routes

// router.get('/service/:serviceId/routes', async (req, res) => { 
//   var s = await models.routes.index(req.params.serviceId)
//   res.json(s)
// })

// router.get('/service/:serviceId/routes/:routeId', async (req, res) => { 
//   var s = await models.routes.get(req.params.routeId)
//   res.json(s)
// })

// router.put('/service/:serviceId/routes', async (req, res) => {
//   var route = req.body
//   route.serviceId = req.params.serviceId
//   var saved = await models.routes.create(route)
//   res.json(saved)
// })

// router.delete('/service/:serviceId/routes/:routeId', async (req, res) => {
//   var r = await models.routes.remove(req.params.routeId)
//   res.json(r)
// })


// // mocks

// router.get('/service/:serviceId/routes/:routeId/mocks', async (req, res) => { 
//   var s = await models.mocks.index(req.params.serviceId, req.params.routeId)
//   res.json(s)
// })

// router.get('/service/:serviceId/routes/:routeId/mocks/:mockId', async (req, res) => { 
//   var s = await models.mocks.get(req.params.mockId)
//   res.json(s)
// })

// router.put('/service/:serviceId/routes/:routeId/mocks', async (req, res) => {
//   var mock = req.body
//   mock = await models.mocks.create({
//     serviceId:req.params.serviceId,
//     routeId:req.params.routeId,
//     mock
//   })
//   res.json(mock)
// })

// router.delete('/service/:serviceId/routes/:routeId/mocks/:mockId', async (req, res) => {
//   logger.log('delete',req.params.mockId)
//   var r = await models.mocks.remove(req.params.mockId)
//   res.json(r)
// })




router.get('/public/microfrontend.js*', async (req, res) => {
  var module_path = `${__dirname}/${req.path.slice(1)}`
  if(req.apiGateway){
    var umd_module = await fs.readFileSync(module_path)
    res.send(umd_module.toString().replace(/http:\/\/localhost:3000/g, 'https://'+req.apiGateway.event.headers.Host))
  }else{
    res.sendFile(module_path)
  }
});

router.get('/public/*', (req, res) => {
  res.sendFile(`${__dirname}/${req.path.slice(1)}`)
})


// The aws-serverless-express library creates a server and listens on a Unix
// Domain Socket for you, so you can remove the usual call to app.listen.
// app.listen(3000)
app.use('/', router)
app.use(AWSXRay.express.closeSegment());


// Export your express server so you can import it in the lambda function.
module.exports = app




