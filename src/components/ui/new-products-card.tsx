'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Package, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getPeriodDates } from '@/lib/period-utils'
import { PeriodType } from '@/components/ui/period-selector'

interface NewProductsCardProps {
  newProducts: number
  previousPeriodNewProducts: number
  period: PeriodType
  className?: string
}

export function NewProductsCard({ 
  newProducts, 
  previousPeriodNewProducts, 
  period,
  className 
}: NewProductsCardProps) {
  const periodDates = getPeriodDates(period)
  
  // Calculer la variation
  const variation = previousPeriodNewProducts > 0 
    ? ((newProducts - previousPeriodNewProducts) / previousPeriodNewProducts) * 100
    : newProducts > 0 ? 100 : 0
  
  const isPositive = variation >= 0
  const variationValue = Math.abs(variation)

  const getComparisonText = (period: PeriodType): string => {
    switch (period) {
      case '30d':
        return 'vs 30 jours précédents'
      case '3m':
        return 'vs 3 mois précédents'
      case '6m':
        return 'vs 6 mois précédents'
      case '1y':
        return 'vs année précédente'
      default:
        return 'vs période précédente'
    }
  }

  const formatDateRange = (start: Date, end: Date): string => {
    const startStr = start.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short' 
    })
    const endStr = end.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      year: period === '1y' ? 'numeric' : undefined
    })
    return `${startStr} - ${endStr}`
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          Nouveaux Produits
        </CardTitle>
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <Plus className="h-3 w-3 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">{newProducts}</div>
          
          {previousPeriodNewProducts > 0 && (
            <div className="flex items-center space-x-2">
              <Badge 
                variant={isPositive ? "default" : "destructive"}
                className={cn(
                  "text-xs",
                  isPositive 
                    ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/20" 
                    : "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/20"
                )}
              >
                {isPositive ? '+' : '-'}{variationValue.toFixed(0)}%
              </Badge>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 cursor-help">
                    <span className="text-xs text-muted-foreground">
                      {getComparisonText(period)}
                    </span>
                    <div className="h-3 w-3 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent 
                  side="top" 
                  className="max-w-xs p-3 bg-popover border border-border rounded-lg shadow-lg"
                >
                  <div className="space-y-2 text-xs">
                    <div>
                      <div className="font-medium text-foreground mb-1">Période actuelle :</div>
                      <div className="text-muted-foreground">
                        {formatDateRange(periodDates.start, periodDates.end)}
                      </div>
                      <div className="text-muted-foreground">
                        {newProducts} nouveau{newProducts > 1 ? 'x' : ''} produit{newProducts > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-foreground mb-1">Période comparée :</div>
                      <div className="text-muted-foreground">
                        {formatDateRange(periodDates.previousStart, periodDates.previousEnd)}
                      </div>
                      <div className="text-muted-foreground">
                        {previousPeriodNewProducts} nouveau{previousPeriodNewProducts > 1 ? 'x' : ''} produit{previousPeriodNewProducts > 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
