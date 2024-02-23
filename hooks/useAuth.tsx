import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect } from "react"

const UserContext = createContext<{
  currentUser: any
  isLoading: boolean
  logout: () => void
}>({
  currentUser: undefined,
  isLoading: true,
  logout: () => {},
})

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const userQuery = useQuery({
    queryKey: ["CURRENT_USER"],
    queryFn: () => supabase.auth.getUser(),
    select: (data) => data.data.user,
  })

  useEffect(() => {
    supabase.auth.onAuthStateChange(() => {
      userQuery.refetch()
    })
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <UserContext.Provider
      value={{
        currentUser: userQuery.data,
        isLoading: userQuery.isLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useUserContext()
//
