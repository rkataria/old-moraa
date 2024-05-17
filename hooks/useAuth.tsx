import { createContext, useContext, useEffect } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

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
  const supabase = createClientComponentClient()
  const userQuery = useQuery({
    queryKey: ['CURRENT_USER'],
    queryFn: () => supabase.auth.getSession(),
    select: (data) => data.data.session?.user,
  })

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      userQuery.refetch()
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

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
