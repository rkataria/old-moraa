import { createContext, useContext } from 'react'

import { useRouter } from '@tanstack/react-router'

import { useStoreSelector } from './useRedux'

import { supabaseClient } from '@/utils/supabase/client'

type UserContextType = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUser: any
  isLoading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType>({
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

  const logout = async () => {
    await supabaseClient.auth.signOut()
    router.navigate({ to: '/' })
  }

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currentUser: userState.user,
        isLoading: userState.isLoading,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useUserContext()
