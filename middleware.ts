import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("better-auth.session_token");

  const isAuthPage = request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/register");
  
  const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
  
  // Páginas públicas que não precisam de autenticação
  const isPublicPage = request.nextUrl.pathname === "/" || 
    request.nextUrl.pathname.startsWith("/api-docs");

  // Se não está logado
  if (!sessionToken) {
    // Se é uma página pública ou de auth, permite o acesso
    if (isPublicPage || isAuthPage) {
      return NextResponse.next();
    }
    // Se é uma página protegida (dashboard), redireciona para login
    if (isDashboard) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Se está logado e tentando acessar páginas de login/registro
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
