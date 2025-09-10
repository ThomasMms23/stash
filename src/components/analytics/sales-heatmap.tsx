'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/period-utils'

// Mock data statique pour éviter les erreurs d'hydratation
const staticHeatmapData = [
  { date: 1, sales: 2, revenue: 400, dayOfWeek: 1, isToday: false },
  { date: 2, sales: 0, revenue: 0, dayOfWeek: 2, isToday: false },
  { date: 3, sales: 1, revenue: 250, dayOfWeek: 3, isToday: false },
  { date: 4, sales: 0, revenue: 0, dayOfWeek: 4, isToday: false },
  { date: 5, sales: 3, revenue: 750, dayOfWeek: 5, isToday: false },
  { date: 6, sales: 2, revenue: 500, dayOfWeek: 6, isToday: false },
  { date: 7, sales: 1, revenue: 300, dayOfWeek: 0, isToday: false },
  { date: 8, sales: 0, revenue: 0, dayOfWeek: 1, isToday: false },
  { date: 9, sales: 2, revenue: 450, dayOfWeek: 2, isToday: false },
  { date: 10, sales: 0, revenue: 0, dayOfWeek: 3, isToday: false },
  { date: 11, sales: 1, revenue: 200, dayOfWeek: 4, isToday: false },
  { date: 12, sales: 0, revenue: 0, dayOfWeek: 5, isToday: false },
  { date: 13, sales: 3, revenue: 600, dayOfWeek: 6, isToday: false },
  { date: 14, sales: 2, revenue: 400, dayOfWeek: 0, isToday: false },
  { date: 15, sales: 0, revenue: 0, dayOfWeek: 1, isToday: false },
  { date: 16, sales: 1, revenue: 350, dayOfWeek: 2, isToday: false },
  { date: 17, sales: 0, revenue: 0, dayOfWeek: 3, isToday: false },
  { date: 18, sales: 2, revenue: 500, dayOfWeek: 4, isToday: false },
  { date: 19, sales: 0, revenue: 0, dayOfWeek: 5, isToday: false },
  { date: 20, sales: 1, revenue: 250, dayOfWeek: 6, isToday: false },
  { date: 21, sales: 2, revenue: 400, dayOfWeek: 0, isToday: false },
  { date: 22, sales: 0, revenue: 0, dayOfWeek: 1, isToday: false },
  { date: 23, sales: 1, revenue: 300, dayOfWeek: 2, isToday: false },
  { date: 24, sales: 0, revenue: 0, dayOfWeek: 3, isToday: false },
  { date: 25, sales: 3, revenue: 750, dayOfWeek: 4, isToday: false },
  { date: 26, sales: 0, revenue: 0, dayOfWeek: 5, isToday: false },
  { date: 27, sales: 2, revenue: 450, dayOfWeek: 6, isToday: false },
  { date: 28, sales: 1, revenue: 200, dayOfWeek: 0, isToday: false },
  { date: 29, sales: 0, revenue: 0, dayOfWeek: 1, isToday: false },
  { date: 30, sales: 1, revenue: 350, dayOfWeek: 2, isToday: false },
]

const getIntensityClass = (sales: number) => {
  if (sales === 0) return 'bg-gray-100 dark:bg-gray-800'
  if (sales === 1) return 'bg-blue-200 dark:bg-blue-900'
  if (sales === 2) return 'bg-blue-400 dark:bg-blue-700'
  if (sales === 3) return 'bg-blue-600 dark:bg-blue-500'
  return 'bg-blue-800 dark:bg-blue-300'
}

const getIntensityTextClass = (sales: number) => {
  if (sales === 0) return 'text-gray-500 dark:text-gray-400'
  if (sales <= 2) return 'text-blue-800 dark:text-blue-200'
  return 'text-white dark:text-blue-100'
}

export function SalesHeatmap() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  
  // Utiliser les données statiques pour éviter les erreurs d'hydratation
  const heatmapData = staticHeatmapData
  
  // Marquer le jour actuel
  useEffect(() => {
    setMounted(true)
    const today = new Date().getDate()
    const updatedData = heatmapData.map(day => ({
      ...day,
      isToday: day.date === today
    }))
    // Note: Dans un vrai projet, vous pourriez vouloir mettre à jour l'état ici
  }, [])
  
  const totalSales = heatmapData.reduce((sum, day) => sum + day.sales, 0)
  const totalRevenue = heatmapData.reduce((sum, day) => sum + day.revenue, 0)
  const averageSalesPerDay = (totalSales / heatmapData.length).toFixed(1)

  // Éviter le rendu côté serveur avec des données dynamiques
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">-</div>
                <div className="text-sm text-muted-foreground">Ventes totales</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">-</div>
                <div className="text-sm text-muted-foreground">Revenus totaux</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">-</div>
                <div className="text-sm text-muted-foreground">Moyenne/jour</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="text-center text-muted-foreground py-8">
          Chargement des données...
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Statistiques du mois */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalSales}</div>
              <div className="text-sm text-muted-foreground">Ventes totales</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
              <div className="text-sm text-muted-foreground">Revenus totaux</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{averageSalesPerDay}</div>
              <div className="text-sm text-muted-foreground">Moyenne/jour</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Activité des ventes</h4>
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <span>Moins</span>
            <div className="flex space-x-1">
              <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded"></div>
              <div className="w-3 h-3 bg-blue-200 dark:bg-blue-900 rounded"></div>
              <div className="w-3 h-3 bg-blue-400 dark:bg-blue-700 rounded"></div>
              <div className="w-3 h-3 bg-blue-600 dark:bg-blue-500 rounded"></div>
              <div className="w-3 h-3 bg-blue-800 dark:bg-blue-300 rounded"></div>
            </div>
            <span>Plus</span>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {/* En-têtes des jours de la semaine */}
          {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, index) => (
            <div key={index} className="text-center text-xs text-muted-foreground p-2">
              {day}
            </div>
          ))}
          
          {/* Jours du mois */}
          {heatmapData.map((day) => {
            const isToday = mounted && day.date === new Date().getDate()
            return (
              <div
                key={day.date}
                className={`
                  relative w-8 h-8 rounded cursor-pointer transition-all hover:scale-110
                  ${getIntensityClass(day.sales)}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                `}
                onClick={() => setSelectedDay(day.date)}
              >
                <div className={`
                  absolute inset-0 flex items-center justify-center text-xs font-medium
                  ${getIntensityTextClass(day.sales)}
                `}>
                  {day.date}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Détails du jour sélectionné */}
      {selectedDay && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Jour {selectedDay}</h4>
                <p className="text-sm text-muted-foreground">
                  {heatmapData.find(d => d.date === selectedDay)?.sales || 0} ventes • {' '}
                  {formatCurrency(heatmapData.find(d => d.date === selectedDay)?.revenue || 0)}
                </p>
              </div>
              <Badge variant="outline">
                {heatmapData.find(d => d.date === selectedDay)?.sales === 0 ? 'Aucune vente' : 'Ventes réalisées'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
