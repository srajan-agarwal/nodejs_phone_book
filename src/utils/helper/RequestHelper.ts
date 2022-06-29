import request from '../config/Axios'

export default class RequestHelper {
  // Get Request
  static async doGet(url: string, sessionKey: string) {
    try {
      const response = await request.get(url, {
        headers: {
          Cookie: `__iQ_ALPS_SESSION=${sessionKey}`,
        },
      })
      return response
    } catch (error) {
      return error
    }
  }
}
