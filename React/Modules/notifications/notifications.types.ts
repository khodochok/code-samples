export interface IState {
  notificationsList: INotification[]
  isLoading: boolean
}

export interface INotification {
  id: number
  title: string
  description: string | null
  type: string
  status: string
  src: string
  createdAt: string
  updatedAt: string
  group: string
  cta: string
  redirectPath: string
}

export interface INotificationList extends INotification {
  key: number
  date: string
}

export interface INotificationIds {
  ids: number[]
}
