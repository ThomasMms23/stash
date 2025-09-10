import { PeriodType } from '@/components/ui/period-selector'

export interface PeriodDates {
  start: Date
  end: Date
  previousStart: Date
  previousEnd: Date
}

export function getPeriodDates(period: PeriodType): PeriodDates {
  const now = new Date()
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999) // Fin de journée
  
  let start: Date
  let previousStart: Date
  let previousEnd: Date
  
  switch (period) {
    case '30d':
      start = new Date(end)
      start.setDate(start.getDate() - 29) // 30 jours incluant aujourd'hui
      start.setHours(0, 0, 0, 0) // Début de journée
      previousEnd = new Date(start)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      previousStart.setDate(previousStart.getDate() - 29)
      previousStart.setHours(0, 0, 0, 0)
      break
      
    case '3m':
      start = new Date(end.getFullYear(), end.getMonth() - 2, end.getDate()) // 3 mois incluant le mois actuel
      start.setHours(0, 0, 0, 0)
      previousEnd = new Date(start)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      previousStart.setMonth(previousStart.getMonth() - 2)
      previousStart.setHours(0, 0, 0, 0)
      break
      
    case '6m':
      start = new Date(end.getFullYear(), end.getMonth() - 5, end.getDate()) // 6 mois incluant le mois actuel
      start.setHours(0, 0, 0, 0)
      previousEnd = new Date(start)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      previousStart.setMonth(previousStart.getMonth() - 5)
      previousStart.setHours(0, 0, 0, 0)
      break
      
    case '1y':
      start = new Date(end.getFullYear(), end.getMonth() - 11, 1) // 12 mois incluant le mois actuel
      start.setHours(0, 0, 0, 0)
      previousEnd = new Date(start)
      previousEnd.setDate(previousEnd.getDate() - 1)
      previousStart = new Date(previousEnd)
      previousStart.setMonth(previousStart.getMonth() - 11)
      previousStart.setHours(0, 0, 0, 0)
      break
      
    default:
      throw new Error(`Période non supportée: ${period}`)
  }
  
  return { start, end, previousStart, previousEnd }
}

export function calculateVariation(current: number, previous: number): {
  value: number
  percentage: number
  isPositive: boolean
} {
  if (previous === 0) {
    return {
      value: current,
      percentage: current > 0 ? 100 : 0,
      isPositive: current > 0
    }
  }
  
  const value = current - previous
  const percentage = (value / previous) * 100
  
  return {
    value,
    percentage: Math.abs(percentage),
    isPositive: value >= 0
  }
}

export function formatVariation(variation: ReturnType<typeof calculateVariation>): string {
  const sign = variation.isPositive ? '+' : '-'
  return `${sign}${variation.percentage.toFixed(1)}%`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value)
}
