'use client'

import { Header } from '@/components/layout/header'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Bell,
  Users,
  CheckCircle,
  Smartphone,
  Monitor,
  Tablet,
  Github,
  Mail
} from 'lucide-react'

export default function LandingPage() {
  const features = [
    {
      icon: Package,
      title: "Gestion d'inventaire",
      description: "Ajoutez, modifiez et suivez vos produits facilement. Upload d'images, catégories, prix d'achat et de vente."
    },
    {
      icon: BarChart3,
      title: "Analytics avancés",
      description: "Visualisez vos performances avec des graphiques interactifs. Revenus, marges, top produits et tendances."
    },
    {
      icon: Bell,
      title: "Notifications intelligentes",
      description: "Alertes de stock faible, nouvelles ventes, et rappels personnalisés pour ne rien manquer."
    },
    {
      icon: TrendingUp,
      title: "Suivi des profits",
      description: "Calcul automatique des marges, bénéfices totaux et ROI pour optimiser votre rentabilité."
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header variant="landing" />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Nouveau Dashboard SaaS
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold tracking-tight">
                  <span className="text-primary">Stash.</span>
                  <br />
                  <span className="text-foreground">Gérer, analyser, vendre</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-lg">
                  Le dashboard complet pour gérer votre business d'achat-revente. 
                  Sneakers, vêtements, accessoires - tout en un seul endroit.
                </p>
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Gratuit à essayer
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Mode démo inclus
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Données sécurisées
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 border">
                <div className="bg-background rounded-xl p-6 shadow-2xl">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-primary-foreground" />
                      </div>
                      <span className="text-xl font-bold">Stash.</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-green-600">€2,450</div>
                          <div className="text-sm text-muted-foreground">Revenus ce mois</div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="text-2xl font-bold text-blue-600">€850</div>
                          <div className="text-sm text-muted-foreground">Bénéfices</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/10 rounded-lg flex items-center justify-center">
                      <BarChart3 className="h-12 w-12 text-primary/60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Tout ce dont vous avez besoin pour réussir
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des outils puissants et intuitifs pour gérer efficacement votre business d'achat-revente
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Prêt à optimiser votre business ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoignez les entrepreneurs qui font confiance à Stash pour gérer leur activité d'achat-revente
            </p>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Nouveau ?</strong> Utilisez le bouton "Voir le Dashboard" dans le header pour créer votre compte. 
                <strong> Curieux ?</strong> Testez avec le "Mode Démo" sans inscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">S</span>
                </div>
                <span className="text-xl font-bold">Stash</span>
              </div>
              <p className="text-muted-foreground">
                Le dashboard moderne pour gérer votre business d'achat-revente efficacement.
              </p>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Produit</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Fonctionnalités</li>
                <li>Mode démo</li>
                <li>Tarification</li>
                <li>Support</li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Contact</h3>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <Github className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
            <p>&copy; 2024 Stash. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}