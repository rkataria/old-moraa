import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { cookies } from "next/headers"

export default async function AuthButton() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user ? (
    <div className="flex flex-col items-center gap-4">
      <h3>Hey, {user.email}!</h3>
      <div className="flex gap-4">
        <Link
          href="/workspaces/1"
          className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
        >
          Workspace
        </Link>
        <form action="/auth/sign-out" method="post">
          <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
            Logout
          </button>
        </form>
      </div>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      Login
    </Link>
  )
}
