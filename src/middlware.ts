import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import {getToken} from "next-auth/jwt"
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

  const token = await getToken({req: request})
  const url = request.nextUrl

  if(token&&
    (
        url.pathname.startsWith('/sign-in') ||
          url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
              url.pathname.startsWith('/') 
    )
){
    return NextResponse.redirect(new URL('/dashboard', request.url))  
}

if(!token && url.pathname.startsWith('/dashboard')){
    return NextResponse.redirect(new URL('/sign-in',request.url));
}


//   return NextResponse.redirect(new URL('/home', request.url))
return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  
  matcher:[
     '/',
     '/sign-in',
     '/sign-up',
     '/dashboard/:path*',
     '/verify/:path*'
  ]
  
}
 

















// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

//->  NextResponse → used to send back a response (like redirect, rewrite, or allow request).
// NextRequest → represents the incoming request to middleware.

// export { default } from "next-auth/middleware"

//-> This imports and re-exports the default NextAuth middleware.

// It adds some built-in authentication handling (like session token parsing).

// You can still add custom logic below (like redirects).


// import {getToken} from "next-auth/jwt"

//-> Function to read the JWT token (the session token) directly from cookies.

// Returns the user session data if logged in, otherwise null.


//   const token = await getToken({req: request})
//   const url = request.nextUrl

// -> getToken({ req }) → checks request cookies → retrieves session token (if exists).

// url → extracts the current request URL so you can check the path.




//   if(token &&
//     (
//         url.pathname.startsWith('/sign-in') ||
//           url.pathname.startsWith('/sign-up') ||
//             url.pathname.startsWith('/verify') ||
//               url.pathname.startsWith('/') 
//     )
// ){
//     return NextResponse.redirect(new URL('/dashboard', request.url))  
// }

//-> If the user already has a token (logged in) and tries to visit:

// /sign-in → login page

// /sign-up → register page

// /verify → email verification page

// / → home page

// Then redirect them to /dashboard.
// ✅ This prevents logged-in users from going back to login/signup pages.




// if(!token && url.pathname.startsWith('/dashboard')){
//     return NextResponse.redirect(new URL('/sign-in',request.url));
// }

// -> If the user has no token (not logged in) but tries to visit /dashboard,
// 👉 Redirect them to /sign-in.
// ✅ This protects private dashboard routes.


// return NextResponse.next()
// ->If no condition matched, continue the request as normal.


// export const config = {
//   matcher:[
//      '/',
//      '/sign-in',
//      '/sign-up',
//      '/dashboard/:path*',
//      '/verify/:path*'
//   ]
// }

// ->Defines which routes this middleware runs on:

// / (homepage)

// /sign-in

// /sign-up

// /dashboard/... (all dashboard subroutes)

// /verify/...

// So middleware won’t run for other routes (like /api/* or /about).




// ✅ In short:
// This middleware checks if a user is logged in or not:

// Logged in → don’t allow them to go to login/signup → redirect to /dashboard.

// Not logged in → don’t allow them to go to /dashboard → redirect to /sign-in.

// Else → continue normally.