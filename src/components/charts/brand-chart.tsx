'use client'

import { formatCurrency } from '@/lib/period-utils'

interface BrandData {
  brand: string
  count: number
  revenue: number
}

interface BrandChartProps {
  data: BrandData[]
  onBrandClick?: (brand: string) => void
}

const BRAND_COLORS = [
  '#3b82f6', // blue-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
  '#06b6d4', // cyan-500
  '#84cc16', // lime-500
  '#f97316', // orange-500
]

export function BrandChart({ data, onBrandClick }: BrandChartProps) {
  // Limiter à 5 marques principales + regrouper les autres
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue)
  const topBrands = sortedData.slice(0, 5)
  const otherBrands = sortedData.slice(5)
  
  const otherRevenue = otherBrands.reduce((sum, brand) => sum + brand.revenue, 0)
  const otherCount = otherBrands.reduce((sum, brand) => sum + brand.count, 0)
  
  const displayData = [
    ...topBrands.map((brand, index) => ({
      ...brand,
      color: BRAND_COLORS[index % BRAND_COLORS.length],
      isOther: false,
    })),
    ...(otherRevenue > 0 ? [{
      brand: 'Autres',
      count: otherCount,
      revenue: otherRevenue,
      color: '#6b7280', // gray-500
      isOther: true,
    }] : [])
  ]

  const totalRevenue = data.reduce((sum, brand) => sum + brand.revenue, 0)
  const top5Revenue = topBrands.reduce((sum, brand) => sum + brand.revenue, 0)
  const top5Percentage = totalRevenue > 0 ? (top5Revenue / totalRevenue) * 100 : 0

  if (displayData.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  const handleBrandClick = (brand: string, isOther: boolean) => {
    if (onBrandClick && !isOther) {
      onBrandClick(brand)
    }
  }

  return (
    <div className="space-y-4">
      {/* Résumé global */}
      <div className="rounded-lg bg-muted/50 p-3">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              Top {Math.min(5, topBrands.length)} marques
            </p>
            <p className="text-xs text-muted-foreground">
              = {top5Percentage.toFixed(0)}% des revenus
            </p>
          </div>
          <div className="text-right flex-shrink-0 ml-4">
            <p className="text-sm font-semibold">
              {formatCurrency(top5Revenue)}
            </p>
            <p className="text-xs text-muted-foreground">
              sur {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Liste des marques */}
      <div className="space-y-3">
        {displayData.map((item, index) => (
          <div 
            key={item.brand} 
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              onBrandClick && !item.isOther 
                ? 'hover:bg-muted/50 cursor-pointer' 
                : 'bg-muted/20'
            }`}
            onClick={() => handleBrandClick(item.brand, item.isOther)}
          >
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div 
                className="w-4 h-4 rounded-full flex-shrink-0" 
                style={{ backgroundColor: item.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold truncate">{item.brand}</span>
                  <span className="text-xs text-muted-foreground hidden sm:inline">
                    ({item.count} produit{item.count > 1 ? 's' : ''})
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : 0}% du total
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-4">
              <div className="text-sm font-bold">
                {formatCurrency(item.revenue)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
