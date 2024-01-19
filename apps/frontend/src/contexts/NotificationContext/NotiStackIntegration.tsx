import { useCallback, useMemo } from "react";
import { Notification, NotificationContext, NotificationProviderProps } from "./NotificationContext"
import { useSnackbar } from 'notistack';


const NotiStackIntegration: React.FC<NotificationProviderProps> = ({ children }) => {
  const { enqueueSnackbar } = useSnackbar()

  const enqueueNotification = useCallback((notification: Notification) => {
    enqueueSnackbar(notification.message, {
      variant: notification.type,
      anchorOrigin: {
        horizontal: 'right',
        vertical: 'top'
      }
    })
  }, [])

  const value = useMemo(() => ({
    enqueueNotification
  }), [])

  return <NotificationContext.Provider value={value}>
    {children}
  </NotificationContext.Provider>
}


export default NotiStackIntegration;