import logger from '../Logger'
import { createProxyMiddleware, RequestHandler, responseInterceptor } from 'http-proxy-middleware'
import type * as http from 'http'
import ProxyResponseHandler from '../../classes/ProxyResponseHandler'
import ProxyRequestRouter from '../../classes/ProxyRequestRouter'
import { ModifiedRequest, ModifiedServerResponse, LogLevel } from '../types/CustomTypes'

// Local interface

// Proxy Middleware
export const proxyMiddleware: RequestHandler = createProxyMiddleware({
  target: process.env.PROXY_TARGET,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  logLevel: process.env.LOG_LEVEL as LogLevel,
  secure: false,
  logProvider: function () {
    return logger
  },
  router: function (req) {
    return ProxyRequestRouter.getReqDomainUrl(req)
  },
  onProxyRes: (proxyRes) => {
    proxyRes.headers['content-security-policy'] = 'frame-ancestors *' // add new header to response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*'
    delete proxyRes.headers['X-Frame-Options'] // remove header from response
  },
})

// App Proxy Middleware
// For inject communicator script
export const appProxyMiddleware: RequestHandler = createProxyMiddleware({
  target: process.env.PROXY_TARGET,
  changeOrigin: true, // for vhosted sites, changes host header to match to target's host
  logLevel: process.env.LOG_LEVEL as LogLevel,
  followRedirects: false,
  secure: false,
  selfHandleResponse: true,
  logProvider: function () {
    return logger
  },
  pathRewrite: (path, _req) => {
    return path.replace(_req.originalUrl, '')
  },
  router: function (req) {
    return ProxyRequestRouter.getProxyUrl(req)
  },
  onProxyReq: function (_proxyReq: http.ClientRequest, req: ModifiedRequest) {
    logger.defaultMeta = {
      type: 'request',
      requestId: req.id,
    }
    _proxyReq.removeHeader('X-Frame-Options')
  },
  onProxyRes: responseInterceptor(async (responseBuffer, _proxyRes, req, res) => {
    const request = req as ModifiedRequest
    const response = res as ModifiedServerResponse
    logger.defaultMeta = {
      type: 'response',
      requestId: request.id,
      statusCode: res.statusCode,
    }
    const proxyResponseHandler = new ProxyResponseHandler(responseBuffer, request, response)
    return proxyResponseHandler.getResponseBuffer()
  }),
})
