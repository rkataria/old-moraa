"use client"

import { MorraLogo } from "@/components/common/MorraLogo"
import { Card, CardHeader, CardBody } from "@chakra-ui/react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { uiColors } from "@/styles/ui-colors"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsClient } from "@uidotdev/usehooks"

export default function Login() {
  const supabase = createClientComponentClient()
  const user = useAuth()
  const router = useRouter()
  const isClient = useIsClient()

  useEffect(() => {
    if (user.currentUser) {
      router.replace("/events")
    }
  }, [user.currentUser])

  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Card flex="1" maxW="400px">
        <CardHeader display="flex" alignItems="center" justifyContent="center">
          <MorraLogo color="primary" />
        </CardHeader>
        <CardBody>
          <Auth
            supabaseClient={supabase}
            redirectTo={isClient ? window.location.origin : '' + "/events"}
            providers={["google"]}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: uiColors.primary,
                  },
                },
              },
            }}
          />
        </CardBody>
      </Card>
    </div>
  )
}
