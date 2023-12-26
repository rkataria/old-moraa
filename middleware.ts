import { NextResponse, type NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

const protectedRoutes = ["/workspaces", "/content-libraries"];

const checkIfProtectedRoute = (pathname: string) => {
  return protectedRoutes.find((route) => pathname?.startsWith(route));
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Get pathname from request
  const pathname = req.nextUrl.pathname;

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const sessionData = await supabase.auth.getSession();

  // console.log("pathname", pathname);
  // console.log("protectedRoutes", checkIfProtectedRoute(pathname));
  // console.log("sessionData", sessionData.data?.session);

  if (!sessionData.data?.session && checkIfProtectedRoute(pathname)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return res;
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
