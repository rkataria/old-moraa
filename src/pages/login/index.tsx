import { Suspense, useEffect } from 'react'

import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { useIsClient } from '@uidotdev/usehooks'
import { useRouter, createFileRoute, useLocation } from '@tanstack/react-router'

import { Loading } from '@/components/common/Loading'
import { MoraaLogo } from '@/components/common/MoraaLogo'
import { useAuth } from '@/hooks/useAuth'
import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

function Login() {
  const user = useAuth()
  const router = useRouter()
  const location = useLocation()
  const { redirectTo } = location.search as { redirectTo: string }

  useEffect(() => {
    if (user.currentUser && redirectTo) {
      router.history.push(`${redirectTo}`)

      return
    }

    if (user.currentUser) {
      router.history.push('/events')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.currentUser, redirectTo])

  const getRedirectUrl = () => {
    if (redirectTo) {
      return `${window.location.origin}${redirectTo}`
    }

    return `${window.location.origin}/events`
  }

  return (
    <div className="h-[100vh] flex items-center justify-center bg-gradient-to-br from-red-600 to-blue-600">
      <Card className="w-[400px] p-4">
        <CardHeader className="flex justify-center items-center">
          <MoraaLogo color="primary" />
        </CardHeader>
        <CardBody>
          <Auth
            supabaseClient={supabaseClient}
            redirectTo={getRedirectUrl()}
            providers={['google']}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#7C3AED',
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

export function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Login />
    </Suspense>
  )
}
