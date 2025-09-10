'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { formatCurrency } from '@/lib/period-utils'

interface CategoryData {
  category: string
  revenue: number
  count: number
  percentage: number
}

interface CategoryDistributionChartProps {
  data: CategoryData[]
}

const COLORS = [
  '#3b82f6', // Bleu
  '#10b981', // Vert
  '#f59e0b', // Orange
  '#ef4444', // Rouge
  '#8b5cf6', // Violet
  '#06b6d4', // Cyan
]

const categoryLabels = {
  SNEAKERS: 'Sneakers',
  CLOTHING: 'Vêtements',
  ACCESSORIES: 'Accessoires',
  ELECTRONICS: 'Électronique',
  COLLECTIBLES: 'Collection',
  OTHER: 'Autre',
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[180px]">
        <p className="text-sm font-semibold text-foreground mb-2">
          {categoryLabels[data.category as keyof typeof categoryLabels] || data.category}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Revenus</span>
            <span className="text-sm font-semibold text-foreground">
              {formatCurrency(data.revenue)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Produits</span>
            <span className="text-sm font-semibold text-foreground">
              {data.count} produit{data.count > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Part</span>
            <span className="text-sm font-semibold text-foreground">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

const CustomLegend = ({ payload }: any) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {payload.map((entry: any, index: number) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {categoryLabels[entry.payload.category as keyof typeof categoryLabels] || entry.payload.category}
          </span>
        </div>
      ))}
    </div>
  )
}

export function CategoryDistributionChart({ data }: CategoryDistributionChartProps) {
  const chartData = data.map((item, index) => ({
    ...item,
    colorIndex: index,
  }))

  if (chartData.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center text-muted-foreground">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ percentage }: any) => `${percentage}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="revenue"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend content={<CustomLegend />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
