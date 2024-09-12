import { useRouter } from '@tanstack/react-router'

import { Button } from '../ui/Button'

import { useAuth } from '@/hooks/useAuth'

export function AuthButton() {
  const router = useRouter()
  const { currentUser } = useAuth()

  return currentUser ? (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center grid gap-6">
        <Button
          size="lg"
          className="bg-white rounded-lg px-8 font-semibold shadow-xl"
          onClick={() => router.navigate({ to: '/events' })}>
          Go to Dashboard
        </Button>
      </div>
    </div>
  ) : (
    <Button
      size="lg"
      className="bg-white rounded-lg px-8 font-medium shadow-2xl"
      onClick={() =>
        router.navigate({
          to: '/login',
          search: {
            redirectTo: '/events/create',
          },
        })
      }>
      Create your first event
    </Button>
  )
}
