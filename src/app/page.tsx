'use client'

import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContainerScroll } from '@/components/ui/container-scroll-animation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Package, 
  BarChart3, 
  Bell
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
      
      {/* Hero Section avec Container Scroll Animation */}
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
        <div className="flex flex-col overflow-hidden">
          <ContainerScroll
            titleComponent={
              <>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50">
                    <TrendingUp className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      Boostez vos ventes
                    </span>
                  </div>
                  <h1 className="text-4xl font-semibold text-black dark:text-white">
              Stash. <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none">Votre inventaire, simplifié</span>
            </h1>
                </div>
              </>
            }
          />
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
                <br/><strong> Curieux ?</strong> Testez avec le "Mode Démo" sans inscription.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}