import { createContext, useContext, useEffect } from 'react'

import { useQuery } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import userflow from 'userflow.js'

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
  const userQuery = useQuery({
    queryKey: ['CURRENT_USER'],
    queryFn: () => supabaseClient.auth.getSession(),
    select: (data) => data.data.session?.user,
  })

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange(() => {
      userQuery.refetch()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    await supabaseClient.auth.signOut()
    router.navigate({ to: '/' })
  }

  useEffect(() => {
    if (!userQuery.data?.id) return
    userflow.init(`${import.meta.env.VITE_USERFLOW_ID}`)
    userflow.identify(userQuery.data.id)
  }, [userQuery?.data?.id])

  return (
    <UserContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        currentUser: userQuery.data,
        isLoading: userQuery.isLoading,
        logout,
      }}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useUserContext()
