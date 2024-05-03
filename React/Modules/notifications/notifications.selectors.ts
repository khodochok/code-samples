import moment from 'moment'
import { createSelector } from 'reselect'
import { MODULE_NAME } from './notifications.constants'
import { INotification, INotificationList } from './notifications.types'
import { NOTIFICATIONS } from 'src/constants'

const selectState = (state: { [MODULE_NAME]: any }) => state[MODULE_NAME]

export const getIsNotificationsListLoading = createSelector(selectState, (state): boolean => state.isLoading)

export const getNotificationsList = createSelector(selectState, (state): INotificationList[] =>
  state.notificationsList.map((notification: INotification) => ({
    ...notification,
    date: moment(notification.createdAt).fromNow(),
    key: notification.id,
  }))
)

export const getUnreadNotificationsNumber = createSelector(
  selectState,
  state =>
    state.notificationsList.filter(
      (notification: INotification) => notification.status === NOTIFICATIONS.STATUSES.UNREAD
    ).length
)
