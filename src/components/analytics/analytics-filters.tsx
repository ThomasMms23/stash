'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { 
  Filter, 
  X, 
  Calendar as CalendarIcon,
  RefreshCw
} from 'lucide-react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface AnalyticsFiltersProps {
  onFilterChange: (filters: {
    period: string
    categories: string[]
    brands: string[]
    statuses: string[]
    compareWithPrevious: boolean
  }) => void
  isLoading: boolean
}

const periods = [
  { value: '7d', label: '7 derniers jours' },
  { value: '30d', label: '30 derniers jours' },
  { value: '3m', label: '3 derniers mois' },
  { value: '6m', label: '6 derniers mois' },
  { value: '1y', label: 'Année en cours' },
  { value: 'custom', label: 'Période personnalisée' },
]

const categories = [
  { value: 'SNEAKERS', label: 'Sneakers' },
  { value: 'CLOTHING', label: 'Vêtements' },
  { value: 'ACCESSORIES', label: 'Accessoires' },
  { value: 'ELECTRONICS', label: 'Électronique' },
  { value: 'COLLECTIBLES', label: 'Collection' },
  { value: 'OTHER', label: 'Autre' },
]

const brands = [
  { value: 'Nike', label: 'Nike' },
  { value: 'Adidas', label: 'Adidas' },
  { value: 'Jordan', label: 'Jordan' },
  { value: 'Supreme', label: 'Supreme' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Casio', label: 'Casio' },
]

const statuses = [
  { value: 'SOLD', label: 'Vendu' },
  { value: 'RESERVED', label: 'Réservé' },
  { value: 'IN_STOCK', label: 'En stock' },
]

export function AnalyticsFilters({ onFilterChange, isLoading }: AnalyticsFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('30d')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handleApplyFilters = () => {
    onFilterChange({
      period: selectedPeriod,
      categories: selectedCategories,
      brands: selectedBrands,
      statuses: selectedStatuses,
      compareWithPrevious,
    })
  }

  const handleResetFilters = () => {
    setSelectedPeriod('30d')
    setSelectedCategories([])
    setSelectedBrands([])
    setSelectedStatuses([])
    setCompareWithPrevious(false)
    setCustomDateRange({ from: undefined, to: undefined })
    onFilterChange({
      period: '30d',
      categories: [],
      brands: [],
      statuses: [],
      compareWithPrevious: false,
    })
  }

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    )
  }

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const removeCategory = (category: string) => {
    setSelectedCategories(prev => prev.filter(c => c !== category))
  }

  const removeBrand = (brand: string) => {
    setSelectedBrands(prev => prev.filter(b => b !== brand))
  }

  const removeStatus = (status: string) => {
    setSelectedStatuses(prev => prev.filter(s => s !== status))
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedBrands.length > 0 || 
                          selectedStatuses.length > 0 ||
                          selectedPeriod !== '30d' ||
                          compareWithPrevious

  return (
    <div className="space-y-6">
      {/* Première ligne - Période et comparaison */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="period">Période</Label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.value} value={period.value}>
                  {period.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedPeriod === 'custom' && (
          <div className="space-y-2">
            <Label>Période personnalisée</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, 'dd/MM/yyyy', { locale: fr })} -{' '}
                        {format(customDateRange.to, 'dd/MM/yyyy', { locale: fr })}
                      </>
                    ) : (
                      format(customDateRange.from, 'dd/MM/yyyy', { locale: fr })
                    )
                  ) : (
                    'Sélectionner une période'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={customDateRange}
                  onSelect={(range) => {
                    if (range) {
                      setCustomDateRange({ from: range.from, to: range.to })
                    } else {
                      setCustomDateRange({ from: undefined, to: undefined })
                    }
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleApplyFilters}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Filter className="h-4 w-4 mr-2" />
            )}
            Appliquer
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetFilters}
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Deuxième ligne - Filtres multi-select */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Catégories */}
        <div className="space-y-2">
          <Label>Catégories</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                Catégories ({selectedCategories.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category.value}`}
                      checked={selectedCategories.includes(category.value)}
                      onCheckedChange={() => toggleCategory(category.value)}
                    />
                    <Label
                      htmlFor={`category-${category.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Marques */}
        <div className="space-y-2">
          <Label>Marques</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                Marques ({selectedBrands.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                {brands.map((brand) => (
                  <div key={brand.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`brand-${brand.value}`}
                      checked={selectedBrands.includes(brand.value)}
                      onCheckedChange={() => toggleBrand(brand.value)}
                    />
                    <Label
                      htmlFor={`brand-${brand.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {brand.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Statuts */}
        <div className="space-y-2">
          <Label>Statuts</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start">
                Statuts ({selectedStatuses.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="space-y-2">
                {statuses.map((status) => (
                  <div key={status.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status.value}`}
                      checked={selectedStatuses.includes(status.value)}
                      onCheckedChange={() => toggleStatus(status.value)}
                    />
                    <Label
                      htmlFor={`status-${status.value}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {status.label}
                    </Label>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Badges des filtres actifs */}
      {(selectedCategories.length > 0 || selectedBrands.length > 0 || selectedStatuses.length > 0) && (
        <div className="space-y-2">
          <Label className="text-sm text-muted-foreground">Filtres actifs :</Label>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1">
                {categories.find(c => c.value === category)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeCategory(category)}
                />
              </Badge>
            ))}
            {selectedBrands.map((brand) => (
              <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                {brands.find(b => b.value === brand)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeBrand(brand)}
                />
              </Badge>
            ))}
            {selectedStatuses.map((status) => (
              <Badge key={status} variant="secondary" className="flex items-center gap-1">
                {statuses.find(s => s.value === status)?.label}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => removeStatus(status)}
                />
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
