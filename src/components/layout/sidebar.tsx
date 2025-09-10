'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Package, 
  TrendingUp, 
  Settings, 
  Users,
  BarChart3,
  FileText,
  User,
  Cog
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Produits',
    href: '/dashboard/products',
    icon: Package,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Rapports',
    href: '/dashboard/reports',
    icon: FileText,
    disabled: true,
    comingSoon: true,
  },
]

const userNavigation = [
  {
    name: 'Mon Profil',
    href: '/dashboard/profile',
    icon: User,
  },
  {
    name: 'Paramètres',
    href: '/dashboard/settings',
    icon: Cog,
  },
]

const adminNavigation = [
  {
    name: 'Utilisateurs',
    href: '/admin/users',
    icon: Users,
  },
  {
    name: 'Paramètres Admin',
    href: '/admin/settings',
    icon: Settings,
  },
]

interface SidebarProps {
  userRole?: string
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-background border-r">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">Stash.</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isDisabled = item.disabled
            
            if (isDisabled) {
              return (
                <Button
                  key={item.name}
                  variant="ghost"
                  disabled
                  className="w-full justify-start opacity-50 cursor-not-allowed"
                >
                  <item.icon className="mr-3 h-4 w-4" />
                  <div className="flex flex-col items-start">
                    <span>{item.name}</span>
                    <span className="text-xs text-muted-foreground">En développement</span>
                  </div>
                </Button>
              )
            }
            
            return (
              <Button
                key={item.name}
                variant={isActive ? 'secondary' : 'ghost'}
                className={cn(
                  'w-full justify-start',
                  isActive && 'bg-secondary text-secondary-foreground'
                )}
                asChild
              >
                <Link href={item.href}>
                  <item.icon className="mr-3 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            )
          })}
        </div>

        {/* Navigation utilisateur */}
        <div className="border-t pt-4 mt-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Mon Compte
            </h3>
          </div>
          <div className="space-y-1">
            {userNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={cn(
                    'w-full justify-start',
                    isActive && 'bg-secondary text-secondary-foreground'
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Navigation admin */}
        {userRole === 'ADMIN' && (
          <>
            <div className="border-t pt-4 mt-4">
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Administration
                </h3>
              </div>
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Button
                      key={item.name}
                      variant={isActive ? 'secondary' : 'ghost'}
                      className={cn(
                        'w-full justify-start',
                        isActive && 'bg-secondary text-secondary-foreground'
                      )}
                      asChild
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-3 h-4 w-4" />
                        {item.name}
                      </Link>
                    </Button>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </nav>
    </div>
  )
}
