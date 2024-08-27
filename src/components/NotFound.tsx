import { Button } from '@nextui-org/button'
import { useRouter } from '@tanstack/react-router'

export function NotFound() {
  const router = useRouter()

  return (
    <div className="w-screen h-screen grid place-items-center">
      <div className="text-center">
        <p className="text-9xl text-primary font-bold">404</p>
        <p className="mt-8 text-xl text-primary">Page Not Found</p>
        <p className="mt-8 text-md text-primary-300">
          Sorry, we can&apos;t find the page you are looking for.
        </p>
        <Button
          size="lg"
          radius="full"
          color="primary"
          className="mt-10 shadow-2xl px-10"
          onClick={() => router.navigate({ to: '/events' })}>
          Back to Home
        </Button>
      </div>
    </div>
  )
}
