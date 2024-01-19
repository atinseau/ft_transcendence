import type { AuthStore } from "@contexts/AuthContext/createAuthStore";
import type { INotificationContext } from "@contexts/NotificationContext/NotificationContext";
import { createUrl } from "@utils";
import { useRouter } from 'next/navigation';
import { createStore } from "zustand";

interface Profile {
  username: string,
  avatar: string,
  flag_avatar: boolean,
  id: string,
  password: string,
  createdAt: string,
  updatedAt: string,
}
interface UserProps {
  profile?: {
    [key: string]: any
    twoFactorEnabled: boolean
  }
  updating?: boolean
}

interface UserActions {
  loadProfile: () => Promise<any>
  updateProfile: (data: {
    username: string
    avatarImage: FileList
  }, cb?: () => void) => Promise<void>
  reset: () => void
  toggleTwoFactor: () => void
}

type UserState = UserProps & UserActions;
type UserStore = ReturnType<typeof createUserStore>

type CreateUserStoreOptions = {
  initialState?: Partial<UserProps>;
  notificationContext: INotificationContext
  router: ReturnType<typeof useRouter>
  authStore: AuthStore
}

const createUserStore = (options: CreateUserStoreOptions) => {

  const {
    initialState = {},
    notificationContext,
    router,
  } = options;

  const { getState, setState } = options.authStore

  return createStore<UserState>((set, get) => {
    const postUpdateProfile = async (data: any): Promise<any> => {
      const formData = new FormData()

      formData.append('username', data.username)
      if (data?.avatarImage && data?.avatarImage.length > 0) {
        formData.append('file', data.avatarImage[0])
      }

      const response = await fetch(createUrl('/user/profile'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${options.authStore.getState().session?.accessToken}`
        },
        body: formData,
      })
      if (response.ok) {
        notificationContext.enqueueNotification({
          message: 'Profile updated successfully',
          type: 'success'
        })
      }
      else {

        if (response.status === 409) {
          notificationContext.enqueueNotification({
            message: 'Username already exists',
            type: 'warning'
          })
          return
        }

        const isRefreshed = await getState().refresh()
        if (!isRefreshed) {
          notificationContext.enqueueNotification({
            message: 'Error while updating profile',
            type: 'error'
          })
        } else {

          return postUpdateProfile(data)
        }

      }
      return await response.json()
      // https://docs.nestjs.com/techniques/file-upload#no-files

    }

    const safeUserRequest = async (
      url: string,
      method: 'GET' | 'PATCH' | 'POST'
    ): Promise<any> => {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${getState().session?.accessToken}`
        }
      })

      if (!response.ok) {
        const isRefreshed = await getState().refresh()
        if (!isRefreshed) {
          throw new Error('User is not logged in anymore')
        }
        return safeUserRequest(url, method)
      }
      return await response.json()
    }

    let fetchingProfile = false

    const loadFromFetch = async () => {
      if (fetchingProfile) {
        return
      }
      try {
        fetchingProfile = true
        const profile = await safeUserRequest(createUrl('/user/profile'), 'GET')
        set({
          profile,
        })
        fetchingProfile = false
      } catch (e) {
        notificationContext.enqueueNotification({
          type: 'warning',
          message: (e as Error).message
        })
        router?.push('/')
      }
    }
    return {
      updating: false,
      loadProfile: async () => {
        return await loadFromFetch()
      },
      updateProfile: async (data, cb) => {
        try {
          set({
            updating: true
          })
          const update = await postUpdateProfile(data)
          if (update) {
            console.log(update)
            cb?.()
            await loadFromFetch();
            set({
              updating: false
            })
          }
        }
        catch (e) {
          notificationContext.enqueueNotification({
            type: 'error',
            message: (e as Error).message
          })
        }
      },
      reset: () => {
        set({
          profile: undefined,
        })
      },

      toggleTwoFactor: async () => {
        const twoFactor = await safeUserRequest(createUrl('/user/2fa'), 'PATCH')

        if (twoFactor.message) {
          notificationContext.enqueueNotification({
            type: 'success',
            message: twoFactor.message
          })
          set({
            profile: {
              ...get().profile,
              twoFactorEnabled: twoFactor.twoFactorEnabled
            }
          })
        }
      }
    }
  }
  )
}

export type {
  UserStore,
  UserState,
  UserProps,
  UserActions,
}

export default createUserStore;