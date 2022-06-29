import { Request, Response, NextFunction } from 'express'
import AuthService from '../services/AuthService'

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { __iQ_ALPS_SESSION: alpsSession, __ALPS_PROXY_SESSION: alpsProxySession } = req.cookies
  const { query } = req
  const tenant = String(query.tenant) || ''
  const sessionKey = alpsSession || alpsProxySession
  if (!sessionKey || !tenant) {
    res.status(401).json({ message: 'Unauthorized' })
    return
  }
  if (await AuthService.isSessionValid(sessionKey, tenant)) {
    return next()
  }
  res.status(401).json({ message: 'Unauthorized' })
}

export default authMiddleware
