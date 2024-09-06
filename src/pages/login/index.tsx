import { Suspense, useEffect, useRef } from 'react'

import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
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
  const loginRef = useRef<HTMLDivElement | null>(null)

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleInputType = (element: any, newButton: HTMLButtonElement) => {
    if (element && element.tagName === 'INPUT') {
      if (element.type === 'text') {
        element.type = 'password'
        newButton.innerHTML =
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z"></path><circle cx="256" cy="256" r="80" fill="none" stroke-miterlimit="10" stroke-width="32"></circle></svg>'
      } else if (element.type === 'password') {
        element.type = 'text'
        newButton.innerHTML =
          '<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
      }
    }
  }

  const addPasswordToggle = () => {
    if (loginRef.current) {
      const element = loginRef.current.querySelector('#password')
      const element2 = loginRef.current.querySelector('#show-pass')
      if (element2) return

      if (element) {
        const newButton = document.createElement('button')
        newButton.innerHTML =
          '<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z"></path><circle cx="256" cy="256" r="80" fill="none" stroke-miterlimit="10" stroke-width="32"></circle></svg>'
        newButton.type = 'button'
        newButton.id = 'show-pass'

        newButton.className =
          'float-right -mt-[30px] mr-[10px] relative cursor-pointer z-[9999] fixed'

        newButton.onclick = () => toggleInputType(element, newButton)

        element.insertAdjacentElement('afterend', newButton)
      } else {
        console.log('Element not found')
      }
    }
  }

  return (
    <div
      ref={loginRef}
      className="h-[100vh] flex items-center justify-center bg-gradient-to-br from-red-600 to-blue-600">
      <Card className="w-[400px] p-4">
        <CardHeader className="flex justify-center items-center">
          <MoraaLogo color="primary" />
        </CardHeader>
        <CardBody onClick={() => addPasswordToggle()}>
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
