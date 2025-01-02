/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { Suspense, useEffect, useRef, useState } from 'react'

import { Card, CardBody, CardHeader } from '@nextui-org/react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter, createFileRoute, useLocation } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Loading } from '@/components/common/Loading'
import { MoraaLogo } from '@/components/common/MoraaLogo'
import { RenderIf } from '@/components/common/RenderIf/RenderIf'
import { useAuth } from '@/hooks/useAuth'
import { supabaseClient } from '@/utils/supabase/client'

export const Route = createFileRoute('/login/')({
  component: LoginPage,
})

function Login() {
  const user = useAuth()
  const router = useRouter()
  const location = useLocation()
  const [showTerms, setShowTerms] = useState(false)
  const { redirectTo, action } = location.search as {
    redirectTo: string
    action: string
  }
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
          '<svg stroke="#9F9999" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z"></path><circle cx="256" cy="256" r="80" fill="none" stroke-miterlimit="10" stroke-width="32"></circle></svg>'
      } else if (element.type === 'password') {
        element.type = 'text'
        newButton.innerHTML =
          '<svg stroke="#9F9999" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
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
          '<svg stroke="#9F9999" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 0 0-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 0 0 0-17.47C428.89 172.28 347.8 112 255.66 112z"></path><circle cx="256" cy="256" r="80" fill="none" stroke-miterlimit="10" stroke-width="32"></circle></svg>'
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

  useEffect(() => {
    if (!loginRef.current) return
    if (action === 'signup') {
      const element: HTMLAnchorElement | null = loginRef.current!.querySelector(
        'a[href="#auth-sign-up"]'
      )
      if (!element) return
      element!.click()
      setShowTerms(true)
    }
  }, [action])

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleClick = (e: any) => {
      const text = e?.target?.textContent.toLowerCase()
      if (text.includes('sign up') || text.includes('sign in')) {
        setShowTerms(text.includes('sign up'))
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div
      ref={loginRef}
      style={{
        background: 'linear-gradient(123deg, #1C0993 0.31%, #9585FF 69.5%)',
      }}
      className="relative w-screen h-screen overflow-hidden grid place-items-center">
      <svg
        width="406"
        height="440"
        viewBox="0 0 406 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute left-0 bottom-0 w-[37vw] h-[37vw]">
        <path
          d="M329.459 228.245L295.054 272.838C366.084 306.282 354.985 386.549 313.922 422.224C291.725 441.176 255.1 450.094 225.135 434.487C199.609 422.224 174.082 394.353 146.336 353.105C138.568 341.957 125.25 320.775 118.591 309.627C111.932 298.479 118.591 282.871 134.128 287.33C276.187 323.005 380.512 156.896 276.187 42.07C216.256 -22.5896 121.92 -4.75246 73.0873 42.07C24.2546 88.8924 19.8153 132.37 32.0234 190.341L91.9545 203.719C68.648 85.548 140.787 47.6441 198.499 63.2516C244.002 75.5146 290.615 146.863 235.123 208.178C147.446 305.168 -22.3585 137.945 -135.562 252.771C-260.973 379.861 -90.0584 587.217 63.0988 464.587C75.307 454.554 81.966 445.635 94.1742 424.453L58.6595 373.172C34.2431 419.994 0.948066 442.29 -33.4568 442.29C-93.3879 442.29 -134.452 378.746 -113.365 323.005C-87.8387 256.115 8.71691 250.541 45.3415 304.053C99.7234 384.32 138.568 446.75 180.741 475.735C246.222 520.328 325.02 496.917 362.754 457.898C419.356 401.042 431.564 289.56 330.569 226.015L329.459 228.245Z"
          fill="#3C2AB0"
          fillOpacity="0.33"
        />
      </svg>
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 100, y: 0 }}
        transition={{ duration: 0.3 }}>
        <Card className="w-[400px] p-4">
          <CardHeader className="flex justify-center items-center">
            <MoraaLogo color="primary" />
          </CardHeader>
          <CardBody onClick={() => addPasswordToggle()}>
            <RenderIf isTrue={showTerms}>
              <p className="mt-0 mb-2 text-[11px] text-center leading-5">
                By signing up for Moraa you acknowledge that you agree to
                Moraa&apos;s{' '}
                <span
                  className="text-primary cursor-pointer"
                  onClick={() => window.open('/terms', '_blank')}>
                  Terms of Service and Privacy
                </span>
              </p>
            </RenderIf>

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
      </motion.div>
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
