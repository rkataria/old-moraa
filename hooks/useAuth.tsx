import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { createContext, useContext, useEffect, useState } from "react"

const UserContext = createContext<{
  currentUser: any
  isLoading: boolean
  logout: () => void
}>({
  currentUser: undefined,
  isLoading: true,
  logout: () => {}
})

export const useUserContext = () => useContext(UserContext)

export const UserContextProvider = ({ children }: React.PropsWithChildren<{}>) => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [currentUser, setCurrentUser] = useState<any>()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setCurrentUser(user)
      setIsLoading(false)
    }

    fetchUser()
    supabase.auth.onAuthStateChange(() => fetchUser())
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }
  return (
    <UserContext.Provider value={{ currentUser, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  )
}

export const useAuth = () => useUserContext()
