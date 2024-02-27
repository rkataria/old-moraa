"use client"

import { MoraaLogo } from "@/components/common/MoraaLogo"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { uiColors } from "@/styles/ui-colors"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useIsClient } from "@uidotdev/usehooks"
import { Card, CardBody, CardHeader } from "@nextui-org/react"

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
    <div className="h-[100vh] flex items-center justify-center bg-gradient-to-br from-red-600 to-blue-600">
      <Card className="w-[400px] p-4">
        <CardHeader className="flex justify-center items-center">
          <MoraaLogo color="primary" />
        </CardHeader>
        <CardBody>
          <Auth
            supabaseClient={supabase}
            redirectTo={isClient ? window.location.origin : "" + "/events"}
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
