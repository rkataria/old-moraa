import { useEffect } from 'react'

import { createRouter, RouterProvider } from '@tanstack/react-router'

import './globals.css'
import { routeTree } from './route-tree.gen'
import { supabaseClient } from './utils/supabase/client'

const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
})

// Register things for typesafety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

export function App() {
  useEffect(() => {
    const getSession = async () => {
      const session = await supabaseClient.auth.getSession()

      router.update({
        context: {
          auth: {
            isAuthenticated: !!session?.data.session,
          },
        },
      })
    }

    getSession()

    supabaseClient.auth.onAuthStateChange(async (_, session) => {
      router.update({
        context: {
          auth: {
            isAuthenticated: !!session,
          },
        },
      })
    })
  }, [])

  return (
    <RouterProvider
      router={router}
      context={{
        auth: {
          isAuthenticated: false,
        },
      }}
    />
  )
}
