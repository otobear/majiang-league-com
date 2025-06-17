import createClient from 'openapi-fetch'
import type { paths } from './schema'

export const baseApi =
  createClient<paths>({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
  }) || ''
export type BaseApi = typeof baseApi
