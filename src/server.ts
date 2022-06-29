import express from 'express'
import actuator from 'express-actuator'
import requestId from 'express-request-id'
import dotenv from 'dotenv'
import cookierParser from 'cookie-parser'
import bodyParser from 'body-parser';
import Environment from './utils/config/Environment'
import { AddressInfo } from 'net'
import informationRouter from './routers/InformationsRouter';
import pool from './dbconfig/dbconnector';

dotenv.config({ path: `.env.${Environment.getEnvironment()}` })
// Import Logger
import logger from './utils/Logger'

// Import Proxy Middleware
import { proxyMiddleware, appProxyMiddleware } from './utils/middleware/ProxyMiddleware'
import authMiddleware from './utils/middleware/AuthMiddleware'

// Create App
const app = express()

// Add bodyParser to parse any body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '1mb' })); // 100kb default

// Add Middleware for check health status and monitor metrics
app.use(actuator())

// Add unique request ID using "request-id/express Middleware
app.use(requestId())

// Add cookie Parser
app.use(cookierParser())

// Handle app Request with Proxy Middleware
// app.use('/alps/app', authMiddleware, appProxyMiddleware)
// app.use('/', proxyMiddleware)
app.use('/api', informationRouter);

pool.connect(function (err, client, done) {
  if (err) {
    console.error('Error while connectiong DB : ', err);
    throw new Error()
  };
  console.log('DB Connected');
});


/* istanbul ignore next */
const port = process.env.PORT || 8080
// App Listen
const server = app.listen(port, function () {
  const { address } = server.address() as AddressInfo
  logger.info(`App listening at http://${address}:${port}`)
})

export default server
