'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatCurrency } from '@/lib/period-utils'

interface RevenueData {
  date: string
  revenue: number
  sales: number
  profit: number
}

interface RevenueEvolutionChartProps {
  data: RevenueData[]
  compareWithPrevious?: boolean
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border rounded-lg shadow-lg p-3 min-w-[200px]">
        <p className="text-sm font-semibold text-foreground mb-2">
          {new Date(label).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          })}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground">
                  {entry.dataKey === 'revenue' ? 'Revenus' : 
                   entry.dataKey === 'sales' ? 'Ventes' : 'Bénéfices'}
                </span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {entry.dataKey === 'sales' ? entry.value : formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function RevenueEvolutionChart({ data, compareWithPrevious = false }: RevenueEvolutionChartProps) {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  const chartData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }))

  if (!mounted) {
    return (
      <div className="h-80 w-full flex items-center justify-center text-muted-foreground">
        <p>Chargement du graphique...</p>
      </div>
    )
  }

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#e5e7eb" 
            strokeOpacity={0.3}
            horizontal={true}
            vertical={false}
          />
          
          <XAxis 
            dataKey="date"
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
          <Legend />
          
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#revenueGradient)"
            name="Revenus"
          />
          
          <Area
            type="monotone"
            dataKey="profit"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#profitGradient)"
            name="Bénéfices"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
