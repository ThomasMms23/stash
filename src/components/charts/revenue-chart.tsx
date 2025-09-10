'use client'

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Dot } from 'recharts'
import { formatCurrency } from '@/lib/period-utils'

interface RevenueData {
  period: string
  revenue: number
  profit: number
}

interface RevenueChartProps {
  data: RevenueData[]
}

// Composant personnalisé pour les points au hover
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#3b82f6"
      stroke="#ffffff"
      strokeWidth={2}
      className="opacity-0 hover:opacity-100 transition-opacity duration-200"
    />
  )
}

// Composant personnalisé pour le tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Accéder aux données brutes depuis payload[0].payload
    const rawData = payload[0].payload
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[160px]">
        <p className="text-sm font-semibold text-gray-800 mb-2">
          {label}
        </p>
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: '#3b82f6' }}
              />
              <span className="text-sm text-gray-600">
                Revenus
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {formatCurrency(rawData.revenue)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: '#10b981' }}
              />
              <span className="text-sm text-gray-600">
                Bénéfices
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-800">
              {formatCurrency(rawData.profit)}
            </span>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-muted-foreground">
        <p>Aucune donnée disponible</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          {/* Grille horizontale uniquement, fine et discrète */}
          <CartesianGrid 
            strokeDasharray="none" 
            stroke="#e5e7eb" 
            strokeOpacity={0.3}
            horizontal={true}
            vertical={false}
          />
          
          {/* Axe X - sans tick-lines, ticks personnalisés */}
          <XAxis 
            dataKey="period" 
            tick={{ 
              fontSize: 12, 
              fill: '#6b7280',
              fontFamily: 'Inter, sans-serif'
            }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
          />
          
          {/* Axe Y - sans tick-lines, ticks personnalisés */}
          <YAxis 
            tick={{ 
              fontSize: 12, 
              fill: '#6b7280',
              fontFamily: 'Inter, sans-serif'
            }}
            axisLine={false}
            tickLine={false}
            tickMargin={8}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k€`}
          />
          
          {/* Tooltip personnalisé */}
          <Tooltip content={<CustomTooltip />} />
          
          {/* Courbe des revenus - lissée avec points au hover */}
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#revenueGradient)"
            name="Revenus"
            dot={false}
            activeDot={<CustomDot />}
          />
          
          {/* Courbe des bénéfices - en arrière-plan */}
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#profitGradient)"
            name="Bénéfices"
            dot={false}
            activeDot={{ r: 3, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
