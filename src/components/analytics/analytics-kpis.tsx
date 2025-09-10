'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Package, 
  Clock, 
  RotateCcw,
  BarChart3
} from 'lucide-react'
import { formatCurrency } from '@/lib/period-utils'

interface KPIData {
  averageMargin: number
  averageDaysToSale: number
  stockTurnoverRate: number
  currentStockValue: number
  totalRevenue: number
  totalProfit: number
  totalSales: number
}

interface AnalyticsKPIsProps {
  data: KPIData
}

export function AnalyticsKPIs({ data }: AnalyticsKPIsProps) {
  const kpis = [
    {
      title: 'Revenus totaux',
      value: formatCurrency(data.totalRevenue),
      icon: DollarSign,
      description: 'Chiffre d\'affaires généré',
      trend: '+12.5%',
      trendPositive: true,
    },
    {
      title: 'Bénéfices totaux',
      value: formatCurrency(data.totalProfit),
      icon: TrendingUp,
      description: 'Marge totale réalisée',
      trend: '+8.3%',
      trendPositive: true,
    },
    {
      title: 'Ventes réalisées',
      value: data.totalSales.toString(),
      icon: Package,
      description: 'Nombre total de ventes',
      trend: '+15.2%',
      trendPositive: true,
    },
    {
      title: 'Marge moyenne',
      value: `${data.averageMargin.toFixed(1)}%`,
      icon: BarChart3,
      description: 'Marge moyenne par produit',
      trend: '+2.1%',
      trendPositive: true,
    },
    {
      title: 'Durée moyenne avant vente',
      value: `${data.averageDaysToSale.toFixed(1)} jours`,
      icon: Clock,
      description: 'Temps moyen en stock',
      trend: '-3.2 jours',
      trendPositive: true,
    },
    {
      title: 'Taux de rotation',
      value: `${data.stockTurnoverRate.toFixed(1)}x`,
      icon: RotateCcw,
      description: 'Rotation du stock',
      trend: '+0.3x',
      trendPositive: true,
    },
    {
      title: 'Valeur du stock actuel',
      value: formatCurrency(data.currentStockValue),
      icon: Package,
      description: 'Valeur potentielle du stock',
      trend: '+5.7%',
      trendPositive: true,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {kpi.title}
            </CardTitle>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value}</div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                {kpi.trendPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={kpi.trendPositive ? 'text-green-500' : 'text-red-500'}>
                  {kpi.trend}
                </span>
              </div>
              <span>vs période précédente</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {kpi.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
