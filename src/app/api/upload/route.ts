import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    // Fonctionnalité d'upload temporairement désactivée
    // Utilisation de Neon DB uniquement (pas de Supabase Storage)
    return NextResponse.json(
      { message: 'Upload d\'images temporairement désactivé' },
      { status: 501 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
