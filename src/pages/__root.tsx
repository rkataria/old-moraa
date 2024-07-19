import { createRootRoute, Outlet } from '@tanstack/react-router'

import { Providers } from '../contexts/Providers'

export function Root() {
  return (
    <Providers>
      <Outlet />
    </Providers>
  )
}

export const Route = createRootRoute({
  component: Root,
})
