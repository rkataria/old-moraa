import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"

export const useAuth = () => {
  const supabase = createClient()
  const [currentUser, setCurrentUser] = useState<any>()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setCurrentUser(user)
    }

    fetchUser()
  }, [])

  return {
    currentUser,
  }
}
