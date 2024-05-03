import { ThunkAction, ThunkDispatch } from 'redux-thunk'
import { AnyAction } from 'redux'
import { AxiosResponse } from 'axios'
import { upload } from '../core/core.actions'
import IAction from 'src/interfaces/IAction'

import * as CONSTANTS from './notifications.constants'
import { STATUS_CODES } from '../../constants'
import { requestHttp, urls } from 'src/api'
import { INotification, INotificationIds } from './notifications.types'
import { getResponseErrorMessage } from 'src/helpers'

export const notificationsListRequest = (): IAction => ({
  type: CONSTANTS.FETCH_NOTIFICATIONS_REQUEST,
})

export const notificationsListSuccess = (notificationsList: INotification[]): IAction => ({
  type: CONSTANTS.FETCH_NOTIFICATIONS_SUCCESS,
  payload: notificationsList,
})

export const notificationsListFailure = (error: string): IAction => ({
  type: CONSTANTS.FETCH_NOTIFICATIONS_FAILURE,
  error,
})

export const updateNotificationsStatusRequest = (notificatonIds: INotificationIds): IAction => ({
  type: CONSTANTS.UPDATE_NOTIFICATIONS_REQUEST,
  payload: notificatonIds,
})

export const updateNotificationsStatusSuccess = (): IAction => ({
  type: CONSTANTS.UPDATE_NOTIFICATIONS_SUCCESS,
})

export const updateNotificationsStatusFailure = (error: string): IAction => ({
  type: CONSTANTS.UPDATE_NOTIFICATIONS_FAILURE,
  error,
})

export const fetchNotificationsList = (): ThunkAction<Promise<AxiosResponse>, {}, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>
): Promise<AxiosResponse> => {
  try {
    dispatch(notificationsListRequest())

    const response = await requestHttp.get(urls.getNotificationsListUrl())
    const { content } = response.data.data

    if (content.results && Array.isArray(content.results)) {
      dispatch(notificationsListSuccess(content.results))
      return content.results
    }

    return response
  } catch (error) {
    dispatch(notificationsListFailure(getResponseErrorMessage(error)))
    return error
  }
}

export const updateNotificationsStatus = (ids: number[]): ThunkAction<void, {}, {}, AnyAction> => async (
  dispatch: ThunkDispatch<{}, {}, AnyAction>
): Promise<void> => {
  try {
    const response = await requestHttp.patch(urls.getNotificationsUpdateStatusUrl(), { ids })

    if (response.status === 200) {
      dispatch(updateNotificationsStatusSuccess())
    }
  } catch (error) {
    dispatch(updateNotificationsStatusFailure(getResponseErrorMessage(error)))
  }
}
