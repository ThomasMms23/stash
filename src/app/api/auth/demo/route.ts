import { NextRequest, NextResponse } from 'next/server'
import { signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    // Vérifier si l'utilisateur est déjà connecté
    const session = await getServerSession(authOptions)
    if (session) {
      return NextResponse.json({ 
        success: true, 
        message: 'Déjà connecté',
        redirectTo: '/dashboard'
      })
    }

    // Rediriger vers la page de connexion avec les identifiants démo pré-remplis
    const demoUrl = new URL('/auth/signin', request.url)
    demoUrl.searchParams.set('demo', 'true')
    demoUrl.searchParams.set('email', 'demo@stash.app')
    
    return NextResponse.json({ 
      success: true, 
      redirectTo: demoUrl.toString()
    })

  } catch (error) {
    console.error('Erreur lors de la connexion démo:', error)
    return NextResponse.json(
      { success: false, message: 'Erreur lors de la connexion démo' },
      { status: 500 }
    )
  }
}
