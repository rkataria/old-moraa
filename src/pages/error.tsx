import { useEffect } from 'react'

import { Button } from '@nextui-org/react'
import { createFileRoute, useRouter } from '@tanstack/react-router'

export function Error({ error }: { error: Error & { digest?: string } }) {
  const router = useRouter()
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="text-center">
        <p className="text-3xl font-semiboldb ">Oops! Something went wrong</p>
        <Button
          className="bg-black text-white mt-4"
          onClick={() => router.navigate({ to: -1 })}>
          Back to previous page
        </Button>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/error')({
  component: Error,
})
