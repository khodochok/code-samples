import { Store, AnyAction } from 'redux'
import { AxiosResponse } from 'axios'
import get from 'lodash/get'

import * as coreActions from 'src/modules/core/core.actions'
import { LOCAL_STORAGE_KEYS, PATHS } from './../constants'
import history from '../utils/history'
import localStorage from 'redux-persist/es/storage'

import { qnotification } from 'quantum_components'
import NOTIFICATION_TYPES from '../constants/notificationTypes'

type Interceptor = (error: any) => any

const serverSuccessInterceptor = (): Interceptor => async (response: AxiosResponse): Promise<AxiosResponse | void> => {
  if (response.data.data && response.data.data.message) {
    qnotification({
      type: NOTIFICATION_TYPES.SUCCESS,
      message: response.data.data.message,
    })
  }

  return Promise.resolve(response)
}

const serverErrorInterceptor = (store: Store<any, AnyAction>): Interceptor => async (
  error: AxiosResponse
): Promise<AxiosResponse | void> => {
  if (error.status >= 500) {
    qnotification({ type: NOTIFICATION_TYPES.ERROR, message: error.status, description: 'Something went wrong.' })
    return Promise.reject(error)
  }

  qnotification({ type: NOTIFICATION_TYPES.ERROR, message: error.data.error.message })

  if (get(error, 'config.skipError', false)) return Promise.reject(error)

  const statusesNoErrors = get(error, 'config.statusesNoErrors', [])

  if (statusesNoErrors.includes(error.status)) return Promise.reject(error)

  if (error.status === 401 || error.status === 403) {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN)
    store.dispatch(coreActions.logoutSuccess())
    history.push(PATHS.SIGN_IN)
    return Promise.reject(error)
  }

  const isServerError = error.status > 300

  if (!isServerError) return Promise.reject(error)

  const isHtmlResponseError = get(error, 'headers.content-type', '').includes('text/html')
  const errorType = isHtmlResponseError ? 'html' : 'text'

  store.dispatch(
    coreActions.setServerError(get(error, 'data.message') || JSON.stringify(error.data) || String(error), errorType)
  )

  return error
}

export { serverSuccessInterceptor, serverErrorInterceptor }
