import { createFileRoute, useLocation, useParams } from '@tanstack/react-router'

export const Route = createFileRoute('/login/messages')({
  component: Messages,
})

export function Messages() {
  const location = useLocation()
  const error = useParams({
    from: location.search,
    select: (params) => params.error,
  })
  const message = useParams({
    from: location.search,
    select: (params) => params.message,
  })

  return (
    <>
      {error && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {message}
        </p>
      )}
    </>
  )
}
