'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { formatCurrency } from '@/lib/period-utils'

interface BrandData {
  brand: string
  revenue: number
  count: number
  percentage: number
}

interface BrandDistributionChartProps {
  data: BrandData[]
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
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[180px]">
        <p className="text-sm font-semibold text-foreground mb-2">
          {data.brand}
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

export function BrandDistributionChart({ data }: BrandDistributionChartProps) {
  const chartData = data
    .sort((a, b) => b.revenue - a.revenue)
    .map((item, index) => ({
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
        <BarChart 
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            {COLORS.map((color, index) => (
              <linearGradient key={index} id={`brandGradient-${index}`} x1="0" y1="0" x2="0" y2="1">
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
            dataKey="brand"
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
          />
          
          <YAxis 
            tick={{ fontSize: 12, fill: '#6b7280' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
          />

          <Tooltip content={<CustomTooltip />} />

          <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={`url(#brandGradient-${entry.colorIndex})`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
