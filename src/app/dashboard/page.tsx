'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { CategoryChart } from '@/components/charts/category-chart'
import { BrandChart } from '@/components/charts/brand-chart'
import { KPICard } from '@/components/ui/kpi-card'
import { NewProductsCard } from '@/components/ui/new-products-card'
import { PeriodSelector, PeriodType } from '@/components/ui/period-selector'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, DollarSign, Percent, TrendingUp, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { useBrandFilter } from '@/hooks/use-brand-filter'

const categoryLabels = {
  SNEAKERS: 'Sneakers',
  CLOTHING: 'Vêtements',
  ACCESSORIES: 'Accessoires',
  ELECTRONICS: 'Électronique',
  COLLECTIBLES: 'Collection',
  OTHER: 'Autre',
}

interface DashboardStats {
  period: string
  current: {
    totalProducts: number
    totalSales: number
    totalRevenue: number
    totalProfit: number
    averageMargin: number
    newProducts: number
  }
  previous: {
    totalSales: number
    totalRevenue: number
    totalProfit: number
    newProducts: number
  }
  variations: {
    sales: { value: number; percentage: number; isPositive: boolean }
    revenue: { value: number; percentage: number; isPositive: boolean }
    profit: { value: number; percentage: number; isPositive: boolean }
    newProducts: { value: number; percentage: number; isPositive: boolean }
  }
  topCategories: Array<{
    category: string
    count: number
    revenue: number
  }>
  topBrands: Array<{
    brand: string
    count: number
    revenue: number
  }>
  periodRevenue: Array<{
    period: string
    revenue: number
    profit: number
  }>
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('30d')
  const { handleBrandClick } = useBrandFilter()

  useEffect(() => {
    fetchStats()
  }, [selectedPeriod])

  const fetchStats = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        toast.error('Erreur lors du chargement des statistiques')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des statistiques...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!stats) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Aucune donnée disponible</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Vue d'ensemble de votre activité d'achat-revente
            </p>
          </div>
          <PeriodSelector 
            value={selectedPeriod} 
            onValueChange={setSelectedPeriod}
          />
        </div>

        {/* Cartes de statistiques avec variations */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <NewProductsCard
            newProducts={stats.current.newProducts}
            previousPeriodNewProducts={stats.previous.newProducts}
            period={selectedPeriod}
          />

          <KPICard
            title="Ventes"
            value={stats.current.totalSales}
            previousValue={stats.previous.totalSales}
            format="number"
            icon={<TrendingUp className="h-4 w-4" />}
            period={selectedPeriod}
          />

          <KPICard
            title="Revenus"
            value={stats.current.totalRevenue}
            previousValue={stats.previous.totalRevenue}
            format="currency"
            icon={<DollarSign className="h-4 w-4" />}
            period={selectedPeriod}
          />

          <KPICard
            title="Bénéfices"
            value={stats.current.totalProfit}
            previousValue={stats.previous.totalProfit}
            format="currency"
            icon={<Percent className="h-4 w-4" />}
            period={selectedPeriod}
          />
        </div>

        {/* Graphiques */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Évolution des Revenus</CardTitle>
              <CardDescription>
                Revenus et bénéfices sur la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RevenueChart data={stats.periodRevenue} />
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Top Catégories</CardTitle>
              <CardDescription>
                Répartition des revenus par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryChart data={stats.topCategories} />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>Top Marques</span>
              </CardTitle>
              <CardDescription>
                Classement basé sur les ventes de la période sélectionnée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BrandChart data={stats.topBrands} onBrandClick={handleBrandClick} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Résumé des Catégories</CardTitle>
              <CardDescription>
                Détail des performances par catégorie
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.topCategories.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">{categoryLabels[category.category as keyof typeof categoryLabels] || category.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {category.count} produit(s)
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{category.revenue.toFixed(2)}€</div>
                      <div className="text-xs text-muted-foreground">
                        {stats.current.totalRevenue > 0 
                          ? (category.revenue / stats.current.totalRevenue * 100).toFixed(1)
                          : 0}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
