import { NextResponse, type NextRequest } from "next/server"
import { createClient } from "@/utils/supabase/middleware"

const protectedRoutes = ["/workspaces", "/content-libraries"]

const checkIfProtectedRoute = (pathname: string) => {
  return protectedRoutes.find((route) => pathname?.startsWith(route))
}

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request)

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const sessionData = await supabase.auth.getSession()

  // Get pathname from request
  const pathname = request.nextUrl.pathname

  // console.log("pathname", pathname)
  // console.log("protectedRoutes", checkIfProtectedRoute(pathname))
  // console.log("sessionData", sessionData.data?.session)

  if (!sessionData.data?.session && checkIfProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return response
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// }
