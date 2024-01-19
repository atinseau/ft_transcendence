'use client';

import { createContext } from "react";
import { SnackbarProvider, VariantType } from 'notistack';
import NotiStackIntegration from "./NotiStackIntegration";

export type Notification = {
  type: VariantType,
  message: string,
}

export interface INotificationContext {
  enqueueNotification: (notification: Notification) => void
}

export const NotificationContext = createContext({} as INotificationContext)

export type NotificationProviderProps = React.PropsWithChildren

const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  return <SnackbarProvider autoHideDuration={3000}>
    <NotiStackIntegration>
      {children}
    </NotiStackIntegration>
  </SnackbarProvider>
}

export default NotificationProvider;