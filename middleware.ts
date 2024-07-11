import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse, type NextRequest } from 'next/server'

const protectedRoutes = [
  '/workspaces',
  '/content-libraries',
  '/events',
  '/event-session',
]

const checkIfProtectedRoute = (pathname: string) =>
  protectedRoutes.find((route) => pathname?.startsWith(route))

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Get pathname from request
  const { pathname } = req.nextUrl

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const sessionData = await supabase.auth.getSession()

  if (!sessionData.data?.session && checkIfProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
