import { redirect } from '@tanstack/react-router'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const beforeLoad = async ({
  location,
  context,
}: {
  location: any
  context: {
    auth: {
      isAuthenticated: boolean
      loading: boolean
    }
  }
}) => {
  if (context.auth.loading) return

  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
}
