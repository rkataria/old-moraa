'use client'

import { useEffect } from 'react'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useIsClient } from '@uidotdev/usehooks'
import { useRouter } from 'next/navigation'

import { Card, CardBody, CardHeader } from '@nextui-org/react'

import { MoraaLogo } from '@/components/common/MoraaLogo'
import { useAuth } from '@/hooks/useAuth'

export default function Login() {
  const supabase = createClientComponentClient()
  const user = useAuth()
  const router = useRouter()
  const isClient = useIsClient()

  useEffect(() => {
    if (user.currentUser) {
      router.replace('/events')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            redirectTo={isClient ? window.location.origin : '/events'}
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
