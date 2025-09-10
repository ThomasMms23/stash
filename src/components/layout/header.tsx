'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { 
  Menu, 
  Eye, 
  Play, 
  Loader2,
  ExternalLink,
  User,
  Settings,
  LogOut
} from 'lucide-react'

interface HeaderProps {
  variant?: 'landing' | 'dashboard'
  className?: string
}

export function Header({ variant = 'landing', className = '' }: HeaderProps) {
  const router = useRouter()
  const [isDemoLoading, setIsDemoLoading] = useState(false)
  const [isSignupLoading, setIsSignupLoading] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleDashboardAccess = async () => {
    setIsSignupLoading(true)
    try {
      // Déconnecter l'utilisateur actuel s'il est connecté
      await signOut({ redirect: false })
      
      // Rediriger vers la page de connexion
      router.push('/auth/signin')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      // Fallback vers la page de connexion même en cas d'erreur
      router.push('/auth/signin')
    } finally {
      setIsSignupLoading(false)
      setIsMobileMenuOpen(false)
    }
  }

  const handleDemoMode = async () => {
    setIsDemoLoading(true)
    try {
      // Déconnecter l'utilisateur actuel s'il est connecté
      await signOut({ redirect: false })
      
      // Rediriger vers la page de connexion avec les identifiants démo pré-remplis
      const demoUrl = new URL('/auth/signin', window.location.origin)
      demoUrl.searchParams.set('demo', 'true')
      demoUrl.searchParams.set('email', 'demo@stash.app')
      
      router.push(demoUrl.toString())
    } catch (error) {
      console.error('Erreur lors de la connexion démo:', error)
      // Fallback vers l'ancienne méthode
      router.push('/dashboard?demo=true')
    } finally {
      setIsDemoLoading(false)
      setIsMobileMenuOpen(false)
    }
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Nom */}
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold">Stash.</span>
            {variant === 'landing' && (
              <Badge variant="secondary" className="text-xs">
                Beta
              </Badge>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {variant === 'landing' && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleDashboardAccess}
                  disabled={isSignupLoading}
                  className="group cursor-pointer"
                >
                  {isSignupLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Déconnexion...
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Essayer le Dashboard
                      <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleDemoMode}
                  disabled={isDemoLoading}
                  className="group relative cursor-pointer"
                >
                  {isDemoLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Connexion...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Mode Démo
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                        !
                      </Badge>
                    </>
                  )}
                </Button>
              </>
            )}

            {variant === 'dashboard' && (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/dashboard/profile')}
                  className="cursor-pointer"
                >
                  <User className="h-4 w-4 mr-2" />
                  Profil
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => router.push('/dashboard/settings')}
                  className="cursor-pointer"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Paramètres
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Ouvrir le menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                      <span className="text-primary-foreground font-bold text-xs">S</span>
                    </div>
                    <span>Stash</span>
                  </SheetTitle>
                  <SheetDescription>
                    {variant === 'landing' 
                      ? 'Choisissez votre mode d\'accès' 
                      : 'Navigation du dashboard'
                    }
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {variant === 'landing' && (
                    <>
                      <Button 
                        className="w-full justify-start cursor-pointer" 
                        onClick={handleDashboardAccess}
                        disabled={isSignupLoading}
                      >
                        {isSignupLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Déconnexion...
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir le Dashboard
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start relative cursor-pointer" 
                        onClick={handleDemoMode}
                        disabled={isDemoLoading}
                      >
                        {isDemoLoading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Connexion...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Mode Démo
                            <Badge variant="destructive" className="ml-2 h-4 w-4 p-0 text-xs">
                              !
                            </Badge>
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {variant === 'dashboard' && (
                    <>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-pointer" 
                        onClick={() => {
                          router.push('/dashboard/profile')
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profil
                      </Button>
                      
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start cursor-pointer" 
                        onClick={() => {
                          router.push('/dashboard/settings')
                          setIsMobileMenuOpen(false)
                        }}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Paramètres
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start cursor-pointer" 
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Déconnexion
                      </Button>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
