"use client"

import { MorraLogo } from "@/components/common/MorraLogo"
import { Card, CardHeader, CardBody } from "@chakra-ui/react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { uiColors } from "@/styles/ui-colors"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function Login() {
  const supabase = createClientComponentClient()

  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Card flex="1" maxW="400px">
        <CardHeader display="flex" alignItems="center" justifyContent="center">
          <MorraLogo color="primary" />
        </CardHeader>
        <CardBody>
          <Auth
            supabaseClient={supabase}
            redirectTo="/events"
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
