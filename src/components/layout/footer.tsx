'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { 
  Github, 
  Mail, 
  Package, 
  BarChart3, 
  Bell, 
  TrendingUp,
  ExternalLink
} from 'lucide-react'

export function Footer() {
  const features = [
    {
      icon: Package,
      title: "Gestion d'inventaire",
      href: "/dashboard/products"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      href: "/dashboard/analytics"
    },
    {
      icon: Bell,
      title: "Notifications",
      href: "/dashboard/settings"
    },
    {
      icon: TrendingUp,
      title: "Dashboard",
      href: "/dashboard"
    }
  ]

  const quickLinks = [
    {
      title: "Mode Démo",
      href: "/auth/signin?demo=true&email=demo%40stash.app",
      external: false
    },
    {
      title: "Créer un compte",
      href: "/auth/signup",
      external: false
    },
    {
      title: "Se connecter",
      href: "/auth/signin",
      external: false
    }
  ]

  const handleDemoMode = () => {
    // Redirection directe vers la page de connexion avec les paramètres démo
    window.location.href = '/auth/signin?demo=true&email=demo%40stash.app'
  }

  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">Stash.</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Votre inventaire, simplifié. Le dashboard moderne pour gérer efficacement votre business d'achat-revente.
            </p>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" asChild className="cursor-pointer">
                <Link href="https://github.com/ThomasMms23" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild className="cursor-pointer">
                <Link href="mailto:contact@stash.app">
                  <Mail className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Fonctionnalités */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Fonctionnalités</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index}>
                  <Link 
                    href={feature.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <feature.icon className="h-3 w-3" />
                    {feature.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Accès rapide */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Accès rapide</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 cursor-pointer"
                  >
                    {link.title}
                    {link.external && <ExternalLink className="h-3 w-3" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mode Démo */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Essayer Stash</h3>
            <div className="space-y-3">
              <Button 
                onClick={handleDemoMode}
                className="w-full cursor-pointer"
                size="sm"
              >
                Mode Démo
              </Button>
              <p className="text-xs text-muted-foreground">
                Testez toutes les fonctionnalités sans créer de compte
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} Stash. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Fait avec ❤️ pour les entrepreneurs</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
