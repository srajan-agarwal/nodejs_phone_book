import { transports, createLogger, format, Logger } from 'winston'
const loggerOptions = {
  level: process.env.PROXY_LOG_LEVEL || 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      handleExceptions: true,
    }),
  ],
  exitOnError: false,
}
const logger = new (createLogger as unknown as Logger)(loggerOptions)

export default logger
