'use client'

import { useState, useEffect, useCallback } from 'react'

interface Notification {
  id: string
  title: string
  message: string
  type: 'LOW_STOCK' | 'NEW_PRODUCT' | 'SALE_COMPLETED' | 'SYSTEM'
  isRead: boolean
  createdAt: string
  product?: {
    id: string
    name: string
    imageUrl?: string
  }
}

interface NotificationData {
  notifications: Notification[]
  unreadCount: number
  hasMore: boolean
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/notifications?limit=20')
      if (response.ok) {
        const data: NotificationData = await response.json()
        setNotifications(data.notifications)
        setUnreadCount(data.unreadCount)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notificationId }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === notificationId ? { ...notif, isRead: true } : notif
          )
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
    }
  }, [])

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications?id=${notificationId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
        const deletedNotification = notifications.find(n => n.id === notificationId)
        if (deletedNotification && !deletedNotification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
    }
  }, [notifications])

  const markAllAsRead = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markAllAsRead: true }),
      })

      if (response.ok) {
        setNotifications(prev =>
          prev.map(notif => ({ ...notif, isRead: true }))
        )
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error)
    }
  }, [])

  const deleteAllNotifications = useCallback(async () => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteAll: true }),
      })

      if (response.ok) {
        setNotifications([])
        setUnreadCount(0)
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de toutes les notifications:', error)
    }
  }, [])

  // Charger les notifications au montage
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Polling toutes les 30 secondes pour les nouvelles notifications
  useEffect(() => {
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    deleteNotification,
    markAllAsRead,
    deleteAllNotifications,
  }
}
