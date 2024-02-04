"use client"

import { MorraLogo } from "@/components/common/MorraLogo"
import { Card, CardHeader, CardBody } from "@chakra-ui/react"
import { Auth } from "@saas-ui/auth"

export default function Login() {
  return (
    <div className="h-[100vh] flex items-center justify-center">
      <Card flex="1" maxW="400px">
        <CardHeader display="flex" alignItems="center" justifyContent="center">
          <MorraLogo color="primary" />
        </CardHeader>
        <CardBody>
          <Auth
            type="password"
            providers={{
              google: {
                name: "Google",
              },
            }}
            schema={"brand"}
          />
        </CardBody>
      </Card>
    </div>
  )
}
