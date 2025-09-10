'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { 
  Search, 
  Package, 
  BarChart3, 
  Settings, 
  LogOut,
  FileText,
  Users,
  TrendingUp
} from 'lucide-react'

interface CommandPaletteProps {
  className?: string
}

interface CommandAction {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
  keywords: string[]
}

export function CommandPalette({ className }: CommandPaletteProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const actions: CommandAction[] = [
    {
      id: 'dashboard',
      title: 'Aller au Dashboard',
      description: 'Page principale avec les statistiques',
      icon: TrendingUp,
      action: () => router.push('/dashboard'),
      keywords: ['dashboard', 'accueil', 'home', 'stats', 'statistiques']
    },
    {
      id: 'products',
      title: 'Aller aux produits',
      description: 'Gérer votre inventaire de produits',
      icon: Package,
      action: () => router.push('/dashboard/products'),
      keywords: ['produits', 'products', 'inventaire', 'stock', 'items']
    },
    {
      id: 'analytics',
      title: 'Aller aux analytics',
      description: 'Analyses et rapports détaillés',
      icon: BarChart3,
      action: () => router.push('/dashboard/analytics'),
      keywords: ['analytics', 'rapports', 'reports', 'analyses', 'graphiques']
    },
    {
      id: 'reports',
      title: 'Aller aux rapports',
      description: 'En développement - Bientôt disponible',
      icon: FileText,
      action: () => {}, // Action vide pour désactiver
      keywords: ['rapports', 'reports', 'documents', 'exports']
    },
    {
      id: 'profile',
      title: 'Mon profil',
      description: 'Gérer vos informations personnelles',
      icon: Users,
      action: () => router.push('/dashboard/profile'),
      keywords: ['profil', 'profile', 'compte', 'account', 'utilisateur']
    },
    {
      id: 'settings',
      title: 'Accéder aux paramètres',
      description: 'Configurer vos préférences',
      icon: Settings,
      action: () => router.push('/dashboard/settings'),
      keywords: ['paramètres', 'settings', 'configuration', 'preferences']
    },
    {
      id: 'logout',
      title: 'Se déconnecter',
      description: 'Fermer votre session',
      icon: LogOut,
      action: () => signOut({ callbackUrl: '/auth/signin' }),
      keywords: ['déconnexion', 'logout', 'signout', 'fermer', 'quitter']
    }
  ]

  // Gestion du raccourci clavier Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setOpen(true)
      }
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleActionSelect = (action: CommandAction) => {
    // Ne pas exécuter l'action si c'est "reports" (désactivé)
    if (action.id === 'reports') {
      return
    }
    action.action()
    setOpen(false)
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setOpen(true)}
            className={`relative cursor-pointer ${className}`}
          >
            <Search className="h-4 w-4" />
            <span className="sr-only">Ouvrir la palette de commandes</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ouvrir la palette de commandes (Cmd+K)</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg sm:max-w-[425px] animate-in fade-in-0 zoom-in-95 duration-200 [&_[data-slot=dialog-close]]:top-3 [&_[data-slot=dialog-close]]:right-3">
          <DialogTitle className="sr-only">Palette de commandes</DialogTitle>
          <Command className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
            <CommandInput 
              placeholder="Rechercher ou taper Cmd+K..." 
              className="h-12 border-0 focus:ring-0"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                Aucun résultat trouvé.
              </CommandEmpty>
              <CommandGroup>
                {actions.map((action) => {
                  const isDisabled = action.id === 'reports'
                  return (
                    <CommandItem
                      key={action.id}
                      value={`${action.title} ${action.description} ${action.keywords.join(' ')}`}
                      onSelect={() => handleActionSelect(action)}
                      className={`flex items-center gap-3 transition-colors ${
                        isDisabled 
                          ? 'opacity-50 cursor-not-allowed' 
                          : 'cursor-pointer hover:bg-accent'
                      }`}
                    >
                      <action.icon className={`h-4 w-4 flex-shrink-0 ${
                        isDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground'
                      }`} />
                      <div className="flex flex-col min-w-0">
                        <span className={`font-medium truncate ${
                          isDisabled ? 'text-muted-foreground/70' : ''
                        }`}>
                          {action.title}
                        </span>
                        <span className={`text-xs truncate ${
                          isDisabled ? 'text-muted-foreground/50' : 'text-muted-foreground'
                        }`}>
                          {action.description}
                        </span>
                      </div>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  )
}
