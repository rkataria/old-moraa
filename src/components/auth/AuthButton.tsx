import { Link } from '@tanstack/react-router'

import { useAuth } from '@/hooks/useAuth'

export function AuthButton() {
  const { currentUser } = useAuth()

  return currentUser ? (
    <div className="flex flex-col items-center gap-4">
      <h3>Hey, {currentUser.email}!</h3>
      <div className="flex gap-4">
        <Link
          to="/events"
          className="py-2 px-4 rounded-md no-underline bg-primary text-white">
          Dashboard
        </Link>
        <form action="/api/auth/sign-out" method="post">
          <button
            type="button"
            className="py-2 px-4 rounded-md no-underline bg-gray-900 text-white">
            Logout
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Link
      to="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-black text-white">
      Login
    </Link>
  )
}
