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
  logger.log('sadf')
  logger.log(req.headers)
  logger.log(req.path)
  var service = req.path.split('/')[1]
  var path = req.path.split('/').slice(2).join('/')
  var mock = await models.mocks.get_mock(req.path.slice(1))
  var responseHeaders = JSON.parse(mock.responseHeaders)
  Object.keys(responseHeaders).forEach((header)=>{
    res.header(header,responseHeaders[header])
  })
  
  res.send(mock.responseBody)
})

router.get('/', (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`)
})



router.get('/mocks', async (req, res) => {
  var mocks = await models.mocks.get_mocks()
  mocks = mocks.map(m=>{
    m = _.mapValues(m.originalItem(), (v)=>{
      if(typeof(v)=='object'){return JSON.stringify(v)}
      return v
    })
    return m
  })
  mocks = _.groupBy(mocks,'Service')
  res.json(mocks)
})

router.get('/mock/:mockId', async (req, res) => { 
  var res = await models.mocks.get_mock(req.params.mockId)
  res.json(res)
})

router.put('/mock', async (req, res) => {
  logger.log(req.body.mockId)
  var saved = await models.mocks.make_mock(req.body)
  res.json(saved)
})

router.delete('/mock/:mockId', async (req, res) => {
  var r = await models.mocks.delete_mock({
    mockId: req.params.mockId
  })
  res.json(r)
})


router.get('/services', async (req, res) => {
  var services = await models.services.get_services()
  res.json(services)
})

router.get('/service/:serviceId', async (req, res) => { 
  var s = await models.services.get_service(req.params.serviceId)
  res.json(s)
})

router.put('/service', async (req, res) => {
  var saved = await models.services.make_service(req.body)
  res.json(saved)
})

router.delete('/service/:serviceId', async (req, res) => {
  var r = await models.service.delete_service({
    serviceId: req.params.serviceId
  })
  res.json(r)
})

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




