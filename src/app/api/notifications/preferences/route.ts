import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Récupérer les préférences de notification de l'utilisateur
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    let preferences = await prisma.notificationPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    // Créer les préférences par défaut si elles n'existent pas
    if (!preferences) {
      preferences = await prisma.notificationPreferences.create({
        data: {
          userId: session.user.id,
          lowStockEnabled: true,
          newProductEnabled: true,
          saleCompletedEnabled: true,
          emailEnabled: false,
        },
      })
    }

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Erreur lors de la récupération des préférences:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Mettre à jour les préférences de notification
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { lowStockEnabled, newProductEnabled, saleCompletedEnabled, emailEnabled } = body

    const preferences = await prisma.notificationPreferences.upsert({
      where: {
        userId: session.user.id,
      },
      update: {
        lowStockEnabled: lowStockEnabled ?? true,
        newProductEnabled: newProductEnabled ?? true,
        saleCompletedEnabled: saleCompletedEnabled ?? true,
        emailEnabled: emailEnabled ?? false,
      },
      create: {
        userId: session.user.id,
        lowStockEnabled: lowStockEnabled ?? true,
        newProductEnabled: newProductEnabled ?? true,
        saleCompletedEnabled: saleCompletedEnabled ?? true,
        emailEnabled: emailEnabled ?? false,
      },
    })

    return NextResponse.json(preferences)
  } catch (error) {
    console.error('Erreur lors de la mise à jour des préférences:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
