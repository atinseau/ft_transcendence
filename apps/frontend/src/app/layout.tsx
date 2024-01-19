import ThemeRegistry from '@contexts/ThemeRegistry/ThemeRegistry'
import '../styles/globals.scss'
import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import AuthProvider from '@contexts/AuthContext/AuthContext'
import NotificationProvider from '@contexts/NotificationContext/NotificationContext'
import UserProvider from '@contexts/UserContext/UserContext'
import InviteProvider from '@contexts/InviteContext/InviteContext'
import useServerStore from '@hooks/useServerStore'

const roboto = Roboto({ // Load default font of Mui
  weight: ['300', '400', '500', '700'],
  subsets: ['latin-ext'],
})

export const metadata: Metadata = {
  title: 'Ft_transcendence - Project',
  description: 'made by 42student team',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const serverStore = useServerStore()

  return (
    <ThemeRegistry options={{ // Setup for emotion with Mui and Tailwind
      key: 'ft',
    }}>
      <html lang="en">
        <body className={roboto.className} id='__next'>
          <NotificationProvider>
            <AuthProvider initialState={{
              session: serverStore.session,
            }}>
              <UserProvider>
				<InviteProvider>
                	{children}
				</InviteProvider>
              </UserProvider>
            </AuthProvider>
          </NotificationProvider>
        </body>
      </html>
    </ThemeRegistry>
  )
}