import cheerio from 'cheerio'
import logger from '../utils/Logger'
import { ModifiedRequest, ModifiedServerResponse } from '../utils/types/CustomTypes'

export default class ProxyResponseHandler {
  private req: ModifiedRequest
  private res: ModifiedServerResponse
  private responseBuffer: Buffer
  constructor(responseBuffer: Buffer, req: ModifiedRequest, res: ModifiedServerResponse) {
    this.responseBuffer = responseBuffer
    this.req = req
    this.res = res
  }

  // Public Functions
  public getResponseBuffer() {
    const { query } = this.req
    const { __iQ_ALPS_SESSION: alpsSession } = this.req.cookies
    /* istanbul ignore next */
    if (query.url) {
      logger.info(`Requested url: ${query.url}`)
      this.manipulateHeaders(String(query.url), alpsSession)
    }

    return this.getCheerIOBuffer(query.removeScript as string)
  }

  // Private Functions
  // Manipulate headers of response
  private manipulateHeaders(url: string, alpsSession: string) {
    const domain = new URL(url)
    this.res.setHeader('content-security-policy', 'frame-ancestors *')
    this.res.setHeader('Access-Control-Allow-Origin', '*')
    this.res.setHeader(
      'Set-Cookie',
      '__ALPS_PROXY_REMOTE_DOMAIN=' + domain.origin + '; path=/; SameSite=None; secure',
    )
    this.res.cookie('__ALPS_PROXY_SESSION', alpsSession, { path: '/' })
    this.res.removeHeader('X-Frame-Options')
  }

  // Append Script in response using cheerio
  private getCheerIOBuffer(removeScript: string) {
    const response = this.responseBuffer.toString('utf8') // convert buffer to string
    const $ = cheerio.load(response)

    // Skip inject script
    if (removeScript !== 'true') {
      const scriptSrc = process.env.SCRIPT_URL
      const scriptNode = `<script type='text/javascript' src=${scriptSrc}?v=${Date.now()} data-communicator-script='true'></script>`
      $('head').prepend(scriptNode)
      logger.info('Script loaded')
    } else {
      logger.info('Skip remove Script')
    }

    return $.html()
  }
}
