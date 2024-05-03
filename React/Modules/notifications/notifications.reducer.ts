import get from 'lodash/get'
import { IState } from './notifications.types'
import * as CONSTANTS from './notifications.constants'
import { NOTIFICATIONS } from 'src/constants'

const initialState: IState = {
  notificationsList: [],
  isLoading: false,
}

export default (state = initialState, action: any) => {
  switch (action.type) {
    case CONSTANTS.FETCH_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        isLoading: true,
      }
    case CONSTANTS.FETCH_NOTIFICATIONS_SUCCESS:
      const notificationsList = action.payload
      return {
        ...state,
        notificationsList,
        isLoading: false,
      }
    case CONSTANTS.FETCH_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
      }
    case CONSTANTS.UPDATE_NOTIFICATIONS_REQUEST:
      return {
        ...state,
        isLoading: false,
      }
    case CONSTANTS.UPDATE_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        isLoading: false,
        notificationsList: state.notificationsList.map(elem => ({
          ...elem,
          status: NOTIFICATIONS.STATUSES.READ,
        })),
      }
    case CONSTANTS.UPDATE_NOTIFICATIONS_FAILURE:
      return {
        ...state,
        isLoading: false,
        createGroupError: action.error,
      }
    default:
      return state
  }
}
