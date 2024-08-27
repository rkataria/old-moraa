/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute, useLocation, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/login/messages')({
  component: Messages,
})

export function Messages() {
  const location = useLocation()
  const error = useParams({
    from: location.search,
    select: (params: any) => params.error,
  } as any)
  const message = useParams({
    from: location.search,
    select: (params: any) => params.message,
  } as any)

  return (
    <>
      {error && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {error as string}
        </p>
      )}
      {message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {message as string}
        </p>
      )}
    </>
  )
}
