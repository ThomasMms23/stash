import { NotificationType } from '@prisma/client'
import { prisma } from '@/lib/prisma'

interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type: NotificationType
  productId?: string
}

export async function createNotification({
  userId,
  title,
  message,
  type,
  productId,
}: CreateNotificationParams) {
  try {
    // Vérifier les préférences de notification de l'utilisateur
    const preferences = await prisma.notificationPreferences.findUnique({
      where: {
        userId,
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
      return false
    }

    const notification = await prisma.notification.create({
      data: {
        title,
        message,
        type,
        userId,
        productId: productId || null,
      },
    })

    return true
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return false
  }
}

// Fonctions spécifiques pour chaque type de notification
export async function notifyLowStock(userId: string, productName: string, productId: string) {
  return createNotification({
    userId,
    title: 'Stock faible',
    message: `Le produit "${productName}" est en stock critique`,
    type: NotificationType.LOW_STOCK,
    productId,
  })
}

export async function notifyNewProduct(userId: string, productName: string, productId: string) {
  return createNotification({
    userId,
    title: 'Nouveau produit ajouté',
    message: `Le produit "${productName}" a été ajouté à votre inventaire`,
    type: NotificationType.NEW_PRODUCT,
    productId,
  })
}

export async function notifySaleCompleted(userId: string, productName: string, amount: number) {
  return createNotification({
    userId,
    title: 'Vente finalisée',
    message: `Vente de "${productName}" pour ${amount.toFixed(2)}€`,
    type: NotificationType.SALE_COMPLETED,
  })
}
