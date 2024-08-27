import { redirect } from '@tanstack/react-router'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const beforeLoad = async ({
  location,
  context,
}: {
  location: any
  context: any
}) => {
  if (!context.auth.isAuthenticated) {
    throw redirect({
      to: '/login',
      search: {
        redirect: location.href,
      },
    })
  }
}
