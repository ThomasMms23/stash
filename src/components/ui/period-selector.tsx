'use client'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CalendarDays } from 'lucide-react'

export type PeriodType = '30d' | '3m' | '6m' | '1y'

interface PeriodSelectorProps {
  value: PeriodType
  onValueChange: (value: PeriodType) => void
  className?: string
}

const periodOptions = [
  { value: '30d' as const, label: '30 derniers jours' },
  { value: '3m' as const, label: '3 derniers mois' },
  { value: '6m' as const, label: '6 derniers mois' },
  { value: '1y' as const, label: '1 an' },
]

export function PeriodSelector({ value, onValueChange, className }: PeriodSelectorProps) {
  return (
    <div className={`flex items-center space-x-2 ${className || ''}`}>
      <CalendarDays className="h-4 w-4 text-muted-foreground" />
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sélectionner une période" />
        </SelectTrigger>
        <SelectContent>
          {periodOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
