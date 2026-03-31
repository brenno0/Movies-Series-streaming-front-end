/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  AxiosError,
} from 'axios'

import Cookie from 'js-cookie'

export interface RequestConfig<TData = unknown>
  extends AxiosRequestConfig<TData> {}

export interface ResponseConfig<TData = unknown> {
  data: TData
  status: number
  statusText: string
  headers: Record<string, string>
  config: RequestConfig
  request?: any
}

export interface ResponseErrorConfig<TError = unknown> extends Error {
  config?: RequestConfig
  code?: string
  request?: any
  response?: {
    data: TError
    status: number
    statusText: string
    headers: Record<string, string>
  }
  isAxiosError: boolean
}

const isAuthenticated = (): boolean => {
  const token = Cookie.get('access_token')
  return !!token
}

const redirectToLogin = (): void => {
  Cookie.remove('access_token')
  Cookie.remove('refresh_token')

  globalThis.location.href = '/auth/sign-in'
}

const apiClient = axios.create({
  baseURL: 'http://localhost:3333',
  timeout: 10000,
})

apiClient.interceptors.request.use(
  (config) => {
    if (
      !isAuthenticated() &&
      globalThis.location.pathname !== '/auth/sign-in'
    ) {
      redirectToLogin()
      return Promise.reject(new Error('Usuário não autenticado'))
    }

    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error: AxiosError) => {
    if (
      error.response?.status === 401 &&
      globalThis.location.pathname !== '/auth/sign-in'
    ) {
      redirectToLogin()
    }
    return Promise.reject(error)
  },
)

async function kubbApiClient<
  TData = unknown,
  TError = unknown,
  TVariables = unknown,
>(config: RequestConfig<TVariables>): Promise<ResponseConfig<TData>> {
  try {
    const response = await apiClient.request<TData>(config)

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers as Record<string, string>,
      config: response.config as RequestConfig,
      request: response.request,
    }
  } catch (error) {
    const axiosError = error as AxiosError<TError>

    const responseError: ResponseErrorConfig<TError> = {
      name: axiosError.name,
      message: axiosError.message,
      config: axiosError.config as RequestConfig,
      code: axiosError.code,
      request: axiosError.request,
      response: axiosError.response
        ? {
            data: axiosError.response.data,
            status: axiosError.response.status,
            statusText: axiosError.response.statusText,
            headers: axiosError.response.headers as Record<string, string>,
          }
        : undefined,
      isAxiosError: axiosError.isAxiosError,
    }

    throw responseError
  }
}

export default kubbApiClient
