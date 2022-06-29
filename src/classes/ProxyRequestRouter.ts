import { Request } from 'express'

// types

export default class ProxyRequestRouter {
  // Public Functions
  public static getProxyUrl(req: Request) {
    return ProxyRequestRouter.getDomainFromQuery(req) || ProxyRequestRouter.getDomainFromCookie(req)
  }

  public static getReqDomainUrl(req: Request) {
    let reqDomain = ProxyRequestRouter.getProxyUrl(req) as string
    const originalUrl = req.originalUrl as string
    const hasPreSlash = /^\//.test(originalUrl)
    if (originalUrl && !hasPreSlash) {
      reqDomain = reqDomain.replace(/\/?$/, '/')
    }
    return reqDomain
  }

  // Private Functions
  // Get domain/url from query
  private static getDomainFromQuery(req: Request) {
    const { query } = req
    if (query.url) {
      return String(query.url)
    }
    return null
  }

  // Get domain/url from cookie
  private static getDomainFromCookie(req: Request) {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { __ALPS_PROXY_REMOTE_DOMAIN } = req.cookies
    return __ALPS_PROXY_REMOTE_DOMAIN || ''
  }
}
