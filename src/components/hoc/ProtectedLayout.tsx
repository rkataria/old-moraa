// app/components/ProtectedLayout.js
import { ReactNode, useEffect } from 'react'

import { useRouter } from '@tanstack/react-router'

import { Loading } from '../common/Loading'

import { useAuth } from '@/hooks/useAuth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ProtectedLayout({ children }: { children: ReactNode }) {
  const { currentUser: user, isLoading: loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.navigate({ to: '/login' })
    }
  }, [loading, user, router])

  if (loading) {
    return <Loading />
  }

  if (!user) {
    router.navigate({ to: '/login' })
  }

  return <div>{children}</div>
}

// eslint-disable-next-line import/no-default-export
export default ProtectedLayout
