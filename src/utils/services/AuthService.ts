import RequestHelper from '../helper/RequestHelper'
import NodeCache from 'node-cache'
import { AxiosResponse } from 'axios'

export default class AuthService {
  static sessionCache = new NodeCache({ maxKeys: 100, stdTTL: 600 })

  // Check session is valid or not
  static async isSessionValid(sessionKey: string, tenant: string) {
    const cachedSessionKey = this.sessionCache.get('sessionKey')
    if (cachedSessionKey) {
      return true
    }
    const authURL = `${process.env.AUTH_URL || ''}/alps/manage/${tenant}/session-validator`
    const response = (await RequestHelper.doGet(authURL, sessionKey)) as AxiosResponse
    if (response.status === 200 && response.data.valid === true) {
      this.sessionCache.set('sessionKey', sessionKey)
      return true
    }
    return false
  }
}
