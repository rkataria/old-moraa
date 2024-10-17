import { useEffect, useState } from 'react'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import './sentry'
import './globals.css'
import { ContentLoading } from './components/common/ContentLoading'
import { ErrorBoundary } from './components/error/SentryErrorBoundry'
import { NotFound } from './components/NotFound'
import { routeTree } from './route-tree.gen'
import { supabaseClient } from './utils/supabase/client'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
  defaultNotFoundComponent() {
    return <NotFound />
  },

  defaultErrorComponent() {
    return <ErrorBoundary />
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  const [authContext, setAuthContext] = useState({
    isAuthenticated: false,
    loading: true,
  })

  useEffect(() => {
    const getSession = async () => {
      const session = await supabaseClient.auth.getSession()

      setAuthContext({
        isAuthenticated: !!session?.data?.session,
        loading: false,
      })
    }

    getSession()

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      setAuthContext({
        isAuthenticated: !!session,
        loading: false,
      })
    })
  }, [])

  if (authContext.loading) {
    return (
      <div className="h-screen">
        <ContentLoading />
      </div>
    )
  }

  return (
    <RouterProvider
      router={router}
      context={{
        auth: authContext,
      }}
    />
  )
}
