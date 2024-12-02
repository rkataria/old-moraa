import { createContext, useContext, useEffect } from 'react'

import * as Sentry from '@sentry/react'
import { useRouter } from '@tanstack/react-router'

import { useStoreSelector } from './useRedux'

import { supabaseClient } from '@/utils/supabase/client'

type UserContextType = {
  isAuthenticated: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any
  isLoading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType>({
  isAuthenticated: false,
  currentUser: undefined,
  isLoading: true,
  logout: () => {},
})

export const useUserContext = () => useContext(UserContext)

export function UserContextProvider({
  children,
}: React.PropsWithChildren<object>) {
  const router = useRouter()
  const userState = useStoreSelector((state) => state.user.currentUser)

  useEffect(() => {
    if (userState.user?.email) {
      Sentry.setUser({
        email: userState.user?.email,
      })
    }
  }, [userState.user?.email])

  const logout = async () => {
    await supabaseClient.auth.signOut()
    router.navigate({ to: '/' })
  }

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        isAuthenticated: !!userState.user,
        currentUser: userState.user,
        isLoading: userState.isLoading,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useUserContext()
