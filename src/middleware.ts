import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')

    // Si on est sur une page d'auth et qu'on est déjà connecté, rediriger vers dashboard
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    // Si on n'est pas connecté et qu'on essaie d'accéder à une route protégée
    if (!isAuth && !isAuthPage) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // Vérification des rôles pour les routes admin
    if (req.nextUrl.pathname.startsWith('/admin') && token?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Autoriser l'accès aux pages d'auth même sans token
        if (req.nextUrl.pathname.startsWith('/auth')) {
          return true
        }
        // Pour les autres routes, vérifier le token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
  ],
}
