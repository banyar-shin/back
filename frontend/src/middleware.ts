import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

// Define protected routes - dashboard and forum will require authentication
const isProtectedRoute = createRouteMatcher(['/dashboard(.*)', '/forum(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Log the path for debugging
  console.log('Middleware running for path:', req.nextUrl.pathname)

  // If the route should be protected, ensure the user is authenticated
  if (isProtectedRoute(req)) {
    console.log('Protecting route:', req.nextUrl.pathname)
    await auth.protect()
  }
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}