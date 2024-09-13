import { useEffect } from 'react'

// eslint-disable-next-line import/no-extraneous-dependencies
import Hotjar from '@hotjar/browser'
import { createRootRoute, Outlet } from '@tanstack/react-router'

import { Providers } from '@/contexts/Providers'

export function Root() {
  useEffect(() => {
    const siteId = import.meta.env.VITE_HOTJAR_ID
    const hotjarVersion = 6

    Hotjar.init(siteId, hotjarVersion)
  }, [])

  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

export const Route = createRootRoute({
  component: Root,
})
