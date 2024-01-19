import { cookies } from 'next/headers'

const useServerStore = () => {

  const sessionCookie = cookies().get(process.env.NEXT_PUBLIC_AUTH_SESSION_KEY || 'session')
  const session = JSON.parse(sessionCookie?.value || '{}')

  return {
    session: session && session?.accessToken && session?.refreshToken ? session : undefined
  }
}

export default await useServerStore;