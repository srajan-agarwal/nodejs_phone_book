export default class Environment {
  static getEnvironment() {
    return process.env.NODE_ENV || 'dev'
  }
}
