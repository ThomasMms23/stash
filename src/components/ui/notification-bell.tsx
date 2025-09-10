'use client'

import { useState } from 'react'
import { Bell, Check, X, AlertTriangle, ShoppingCart, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useNotifications } from '@/hooks/use-notifications'

const notificationIcons = {
  LOW_STOCK: AlertTriangle,
  NEW_PRODUCT: Plus,
  SALE_COMPLETED: ShoppingCart,
  SYSTEM: Bell,
}

const notificationColors = {
  LOW_STOCK: 'text-orange-500',
  NEW_PRODUCT: 'text-blue-500',
  SALE_COMPLETED: 'text-green-500',
  SYSTEM: 'text-purple-500',
}

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    deleteNotification,
    deleteAllNotifications,
  } = useNotifications()

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId)
  }

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId)
    toast.success('Notification supprimée')
  }

  const handleMarkAllAsRead = async () => {
    await deleteAllNotifications()
    toast.success('Toutes les notifications supprimées')
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative cursor-pointer">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between p-4 pb-2">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="text-xs"
            >
              Tout effacer
            </Button>
          )}
        </div>
        
        <Separator />
        
        <ScrollArea className="h-96">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="text-sm text-muted-foreground">Chargement...</div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <Bell className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Aucune notification</p>
            </div>
          ) : (
            <div className="p-2">
              {notifications.map((notification) => {
                const Icon = notificationIcons[notification.type]
                const colorClass = notificationColors[notification.type]
                
                return (
                  <div
                    key={notification.id}
                    className={`relative p-3 rounded-lg transition-colors hover:bg-accent ${
                      !notification.isRead ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`h-4 w-4 mt-0.5 flex-shrink-0 ${colorClass}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-tight">
                              {notification.title}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            {notification.product && (
                              <p className="text-xs text-blue-600 mt-1">
                                Produit: {notification.product.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNotification(notification.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </p>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r" />
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}