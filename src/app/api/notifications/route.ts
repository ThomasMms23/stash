import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { NotificationType } from '@prisma/client'

// GET - Récupérer les notifications de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    })

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit,
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// POST - Créer une nouvelle notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { title, message, type, productId } = body

    // Vérifier les préférences de notification de l'utilisateur
    const preferences = await prisma.notificationPreferences.findUnique({
      where: {
        userId: session.user.id,
      },
    })

    // Vérifier si ce type de notification est activé
    let isEnabled = true
    if (preferences) {
      switch (type) {
        case NotificationType.LOW_STOCK:
          isEnabled = preferences.lowStockEnabled
          break
        case NotificationType.NEW_PRODUCT:
          isEnabled = preferences.newProductEnabled
          break
        case NotificationType.SALE_COMPLETED:
          isEnabled = preferences.saleCompletedEnabled
          break
        default:
          isEnabled = true
      }
    }

    if (!isEnabled) {
      return NextResponse.json({ message: 'Notification désactivée par les préférences' })
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId: session.user.id,
        productId: productId || null,
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
          },
        },
      },
    })

    return NextResponse.json(notification)
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// PUT - Marquer une notification comme lue
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const { notificationId, markAllAsRead, deleteAll } = body

    if (deleteAll) {
      // Supprimer toutes les notifications de l'utilisateur
      await prisma.notification.deleteMany({
        where: {
          userId: session.user.id,
        },
      })
    } else if (markAllAsRead) {
      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })
    } else if (notificationId) {
      await prisma.notification.updateMany({
        where: {
          id: notificationId,
          userId: session.user.id,
        },
        data: {
          isRead: true,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// DELETE - Supprimer une notification
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json({ error: 'ID de notification requis' }, { status: 400 })
    }

    await prisma.notification.deleteMany({
      where: {
        id: notificationId,
        userId: session.user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur lors de la suppression de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
