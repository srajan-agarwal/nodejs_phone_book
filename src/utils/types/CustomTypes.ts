import { Request } from 'express'
import { ServerResponse } from 'http'

// Types
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'silent'

export type CookieListType = {
  [key: string]: string
}

// Interfaces
export interface ModifiedRequest extends Request {
  id?: string
}
export interface ModifiedServerResponse extends ServerResponse {
  cookie(
    name: string,
    value: string,
    args?: {
      path?: string
    },
  ): void
}
