import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export const useAuth = () => {
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
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return {
    currentUser,
    isLoading,
    logout,
  }
}
