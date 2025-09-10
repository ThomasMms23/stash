'use client'

import { useState, useEffect } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { CommandPalette } from '@/components/ui/command-palette'
import { NotificationBell } from '@/components/ui/notification-bell'
import { Menu, Moon, Sun, User, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'

interface TopbarProps {
  onMenuClick?: () => void
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  // Éviter l'erreur d'hydratation
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/signin' })
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden cursor-pointer"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <CommandPalette />
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={toggleTheme} className="cursor-pointer">
          {mounted ? (
            theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </Button>

        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full cursor-pointer">
              <Avatar className="h-8 w-8">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || ''} />
                <AvatarFallback>
                  {session?.user?.name?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session?.user?.name || 'Utilisateur'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session?.user?.email}
                </p>
                {session?.user?.role && (
                  <Badge variant="outline" className="w-fit mt-1">
                    {session.user.role}
                  </Badge>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              <User className="mr-2 h-4 w-4" />
              Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Paramètres
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Se déconnecter
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
