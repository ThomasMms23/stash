'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Calendar,
  Filter,
  Download,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react'
import { RevenueChart } from '@/components/charts/revenue-chart'
import { CategoryChart } from '@/components/charts/category-chart'
import { BrandChart } from '@/components/charts/brand-chart'
import { formatCurrency } from '@/lib/period-utils'
import { toast } from 'sonner'
import { exportToCSV, exportToPDF, ExportData, categoryLabels } from '@/lib/export-utils'

interface AnalyticsData {
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

export default function AnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [viewMode, setViewMode] = useState<'charts' | 'tables'>('charts')

  useEffect(() => {
    fetchAnalyticsData()
  }, [selectedPeriod])

  const fetchAnalyticsData = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/dashboard/stats?period=${selectedPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setAnalyticsData(data)
      } else {
        toast.error('Erreur lors du chargement des données analytics')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = (format: 'csv' | 'pdf') => {
    if (!analyticsData) {
      toast.error('Aucune donnée à exporter')
      return
    }

    try {
      // Préparer les données pour l'export
      const exportData: ExportData = {
        categories: analyticsData.topCategories.map(cat => ({
          category: categoryLabels[cat.category as keyof typeof categoryLabels] || cat.category,
          count: cat.count,
          revenue: cat.revenue,
          percentage: analyticsData.current.totalRevenue > 0 
            ? (cat.revenue / analyticsData.current.totalRevenue) * 100 
            : 0
        })),
        brands: analyticsData.topBrands.map(brand => ({
          brand: brand.brand,
          count: brand.count,
          revenue: brand.revenue,
          percentage: analyticsData.current.totalRevenue > 0 
            ? (brand.revenue / analyticsData.current.totalRevenue) * 100 
            : 0
        })),
        periodRevenue: analyticsData.periodRevenue,
        kpis: {
          totalRevenue: analyticsData.current.totalRevenue,
          totalProfit: analyticsData.current.totalProfit,
          totalSales: analyticsData.current.totalSales,
          averageMargin: analyticsData.current.averageMargin
        },
        period: selectedPeriod,
        generatedAt: new Date()
      }

      if (format === 'csv') {
        exportToCSV(exportData)
        toast.success('Export CSV téléchargé avec succès')
      } else if (format === 'pdf') {
        exportToPDF(exportData)
        toast.success('Export PDF téléchargé avec succès')
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      toast.error('Erreur lors de l\'export')
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement des analytics...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!analyticsData) {
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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
            <p className="text-muted-foreground">
              Analysez vos performances et optimisez votre business
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="mr-2 h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtres
            </CardTitle>
            <CardDescription>
              Personnalisez votre analyse avec les filtres ci-dessous
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30d">30 derniers jours</SelectItem>
                    <SelectItem value="3m">3 derniers mois</SelectItem>
                    <SelectItem value="6m">6 derniers mois</SelectItem>
                    <SelectItem value="1y">Année en cours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="compare">Comparaison</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="compare"
                    checked={compareWithPrevious}
                    onCheckedChange={setCompareWithPrevious}
                  />
                  <Label htmlFor="compare">Comparer avec la période précédente</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="view">Vue</Label>
                <Select value={viewMode} onValueChange={(value) => setViewMode(value as 'charts' | 'tables')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une vue" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="charts">Graphiques</SelectItem>
                    <SelectItem value="tables">Tableaux</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus totaux</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.current.totalRevenue)}</div>
              {compareWithPrevious && (
                <p className="text-xs text-muted-foreground">
                  {analyticsData.variations.revenue.isPositive ? '+' : ''}{analyticsData.variations.revenue.percentage.toFixed(1)}% vs période précédente
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bénéfices totaux</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(analyticsData.current.totalProfit)}</div>
              {compareWithPrevious && (
                <p className="text-xs text-muted-foreground">
                  {analyticsData.variations.profit.isPositive ? '+' : ''}{analyticsData.variations.profit.percentage.toFixed(1)}% vs période précédente
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventes réalisées</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.current.totalSales}</div>
              {compareWithPrevious && (
                <p className="text-xs text-muted-foreground">
                  {analyticsData.variations.sales.isPositive ? '+' : ''}{analyticsData.variations.sales.percentage.toFixed(1)}% vs période précédente
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marge moyenne</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.current.averageMargin.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">
                Marge moyenne par produit
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'charts' | 'tables')}>
          <TabsContent value="charts" className="space-y-6">
            <div className="grid gap-6">
              {/* Graphiques principaux */}
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Évolution des revenus
                    </CardTitle>
                    <CardDescription>
                      Revenus et bénéfices sur la période sélectionnée
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RevenueChart data={analyticsData.periodRevenue} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Répartition par catégorie
                    </CardTitle>
                    <CardDescription>
                      Distribution des revenus par catégorie de produits
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CategoryChart data={analyticsData.topCategories} />
                  </CardContent>
                </Card>
              </div>

              {/* Graphiques secondaires */}
              <div className="grid gap-6 lg:grid-cols-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Top marques
                    </CardTitle>
                    <CardDescription>
                      Performance des marques par revenus générés
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BrandChart data={analyticsData.topBrands} />
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="tables" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Top catégories
                  </CardTitle>
                  <CardDescription>
                    Performance des catégories par revenus générés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Catégorie</th>
                          <th className="text-right py-2">Produits vendus</th>
                          <th className="text-right py-2">Revenus</th>
                          <th className="text-right py-2">Part</th>
                          {compareWithPrevious && (
                            <th className="text-right py-2">Évolution</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.topCategories.map((category, index) => (
                          <tr key={category.category} className="border-b">
                            <td className="py-2">{categoryLabels[category.category as keyof typeof categoryLabels] || category.category}</td>
                            <td className="text-right py-2">{category.count}</td>
                            <td className="text-right py-2">{formatCurrency(category.revenue)}</td>
                            <td className="text-right py-2">
                              {analyticsData.current.totalRevenue > 0 
                                ? ((category.revenue / analyticsData.current.totalRevenue) * 100).toFixed(1)
                                : 0}%
                            </td>
                            {compareWithPrevious && (
                              <td className="text-right py-2">
                                <span className="text-green-600">+12.5%</span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Top marques
                  </CardTitle>
                  <CardDescription>
                    Performance des marques par revenus générés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Marque</th>
                          <th className="text-right py-2">Produits vendus</th>
                          <th className="text-right py-2">Revenus</th>
                          <th className="text-right py-2">Part</th>
                          {compareWithPrevious && (
                            <th className="text-right py-2">Évolution</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.topBrands.map((brand, index) => (
                          <tr key={brand.brand} className="border-b">
                            <td className="py-2">{brand.brand}</td>
                            <td className="text-right py-2">{brand.count}</td>
                            <td className="text-right py-2">{formatCurrency(brand.revenue)}</td>
                            <td className="text-right py-2">
                              {analyticsData.current.totalRevenue > 0 
                                ? ((brand.revenue / analyticsData.current.totalRevenue) * 100).toFixed(1)
                                : 0}%
                            </td>
                            {compareWithPrevious && (
                              <td className="text-right py-2">
                                <span className="text-green-600">+8.3%</span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}