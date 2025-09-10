'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react'
import { formatCurrency, formatNumber, formatVariation, getPeriodDates, PeriodType } from '@/lib/period-utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface KPICardProps {
  title: string
  value: number
  previousValue: number
  format?: 'currency' | 'number' | 'percentage'
  icon?: React.ReactNode
  period?: PeriodType
  className?: string
}

export function KPICard({ 
  title, 
  value, 
  previousValue, 
  format = 'currency', 
  icon,
  period = '30d',
  className 
}: KPICardProps) {
  const variation = previousValue === 0 
    ? { value: value, percentage: value > 0 ? 100 : 0, isPositive: value > 0 }
    : {
        value: value - previousValue,
        percentage: Math.abs(((value - previousValue) / previousValue) * 100),
        isPositive: value >= previousValue
      }

  // Obtenir les dates des périodes
  const periodDates = getPeriodDates(period)

  // Fonction pour obtenir le texte de comparaison selon la période
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

  // Fonction pour formater les dates pour le tooltip
  const formatDateRange = (start: Date, end: Date): string => {
    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }).format(date)
    }
    return `${formatDate(start)} – ${formatDate(end)}`
  }

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return formatCurrency(val)
      case 'percentage':
        return `${val.toFixed(1)}%`
      case 'number':
      default:
        return formatNumber(val)
    }
  }

  const getVariationIcon = () => {
    if (variation.percentage === 0) return <Minus className="h-3 w-3" />
    return variation.isPositive 
      ? <TrendingUp className="h-3 w-3" />
      : <TrendingDown className="h-3 w-3" />
  }

  const getVariationColor = () => {
    if (variation.percentage === 0) return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
    return variation.isPositive 
      ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
      : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-bold">
            {formatValue(value)}
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
              className={`${getVariationColor()} text-xs font-medium`}
            >
              <div className="flex items-center space-x-1">
                {getVariationIcon()}
                <span>{formatVariation(variation)}</span>
              </div>
            </Badge>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-1 cursor-help">
                  <span className="text-xs text-muted-foreground">
                    {getComparisonText(period)}
                  </span>
                  <Info className="h-3 w-3 text-muted-foreground" />
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
                  </div>
                  <div>
                    <div className="font-medium text-foreground mb-1">Période comparée :</div>
                    <div className="text-muted-foreground">
                      {formatDateRange(periodDates.previousStart, periodDates.previousEnd)}
                    </div>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
