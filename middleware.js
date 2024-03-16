import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isCookiesExist = !!request.cookies.get("user_token");
  const isLoginPage = pathname.startsWith("/login");

  // Jika cookies tidak ada dan user tidak lagi dihalaman login redirect ke /login
  if (isCookiesExist === false && !isLoginPage) {
    return NextResponse.redirect(new URL("login", request.url));
  }

  // Jika cookies ada dan user lagi dihalaman login redirect ke /
  if (isCookiesExist && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  console.log("pathname => ", isCookiesExist);

  // return NextResponse.redirect(new URL("/home", request.url));
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
