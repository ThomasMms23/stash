'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/period-utils'

type Category = 'SNEAKERS' | 'CLOTHING' | 'ACCESSORIES' | 'ELECTRONICS' | 'COLLECTIBLES' | 'OTHER'

interface CategoryData {
  category: Category
  count: number
  revenue: number
}

interface CategoryChartProps {
  data: CategoryData[]
}

const categoryLabels = {
  SNEAKERS: 'Sneakers',
  CLOTHING: 'Vêtements',
  ACCESSORIES: 'Accessoires',
  ELECTRONICS: 'Électronique',
  COLLECTIBLES: 'Collection',
  OTHER: 'Autre',
}

const COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
]

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[180px]">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {data.name}
        </p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Revenus</span>
            <span className="text-sm font-semibold text-gray-800">
              {formatCurrency(data.revenue)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Produits</span>
            <span className="text-sm font-semibold text-gray-800">
              {data.count} produit{data.count > 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Part</span>
            <span className="text-sm font-semibold text-gray-800">
              {data.percentage}%
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function CategoryChart({ data }: CategoryChartProps) {
  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0)

  const chartData = data
    .map((item, index) => ({
      name: categoryLabels[item.category],
      revenue: item.revenue,
      count: item.count,
      percentage: totalRevenue > 0 ? ((item.revenue / totalRevenue) * 100).toFixed(1) : '0',
      colorIndex: index,
    }))
    .sort((a, b) => b.revenue - a.revenue)

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full category-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          data={chartData}
          layout="vertical"
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          {/* Dégradés */}
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.8}/>
                <stop offset="100%" stopColor={color} stopOpacity={1}/>
              </linearGradient>
            ))}
          </defs>

          <CartesianGrid 
            stroke="#e5e7eb"
            strokeOpacity={0.3}
            horizontal={true}
            vertical={false}
          />

          <XAxis 
            type="number"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
          />
          
          <YAxis 
            type="category"
            dataKey="name"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#gradient-${entry.colorIndex})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
