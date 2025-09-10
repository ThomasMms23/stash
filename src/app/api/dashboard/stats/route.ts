import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Category, TransactionType } from '@prisma/client'
import { getPeriodDates, calculateVariation } from '@/lib/period-utils'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const period = (searchParams.get('period') as '30d' | '3m' | '6m' | '1y') || '30d'
    
    const { start, end, previousStart, previousEnd } = getPeriodDates(period)

    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      where: { userId },
      include: { transactions: true },
    })

    // Filtrer les produits vendus dans la période actuelle
    const currentPeriodProducts = products.filter(p => 
      p.status === 'SOLD' && 
      p.soldAt && 
      p.soldAt >= start && 
      p.soldAt <= end
    )

    // Filtrer les produits vendus dans la période précédente
    const previousPeriodProducts = products.filter(p => 
      p.status === 'SOLD' && 
      p.soldAt && 
      p.soldAt >= previousStart && 
      p.soldAt <= previousEnd
    )

    // Calculer les nouveaux produits ajoutés sur chaque période
    const newProductsCurrentPeriod = products.filter(p => 
      p.createdAt >= start && p.createdAt <= end
    )
    
    const newProductsPreviousPeriod = products.filter(p => 
      p.createdAt >= previousStart && p.createdAt <= previousEnd
    )

    // Calculer les statistiques pour la période actuelle
    const currentStats = {
      totalProducts: products.length, // Total produits dans l'inventaire
      totalSales: currentPeriodProducts.length,
      totalRevenue: currentPeriodProducts.reduce((sum, product) => sum + product.sellingPrice, 0),
      totalCost: currentPeriodProducts.reduce((sum, product) => sum + product.purchasePrice, 0),
      newProducts: newProductsCurrentPeriod.length, // Nouveaux produits de la période
    }
    currentStats.totalProfit = currentStats.totalRevenue - currentStats.totalCost
    currentStats.averageMargin = currentPeriodProducts.length > 0 
      ? currentPeriodProducts.reduce((sum, product) => sum + (product.sellingPrice - product.purchasePrice), 0) / currentPeriodProducts.length 
      : 0

    // Calculer les statistiques pour la période précédente
    const previousStats = {
      totalSales: previousPeriodProducts.length,
      totalRevenue: previousPeriodProducts.reduce((sum, product) => sum + product.sellingPrice, 0),
      totalCost: previousPeriodProducts.reduce((sum, product) => sum + product.purchasePrice, 0),
      newProducts: newProductsPreviousPeriod.length,
    }
    previousStats.totalProfit = previousStats.totalRevenue - previousStats.totalCost

    // Calculer les variations
    const variations = {
      sales: calculateVariation(currentStats.totalSales, previousStats.totalSales),
      revenue: calculateVariation(currentStats.totalRevenue, previousStats.totalRevenue),
      profit: calculateVariation(currentStats.totalProfit, previousStats.totalProfit),
      newProducts: calculateVariation(currentStats.newProducts, previousStats.newProducts),
    }

    // Top catégories (produits vendus dans la période actuelle)
    const categoryStats = currentPeriodProducts.reduce((acc, product) => {
      const category = product.category
      if (!acc[category]) {
        acc[category] = { count: 0, revenue: 0 }
      }
      acc[category].count++
      acc[category].revenue += product.sellingPrice
      return acc
    }, {} as Record<Category, { count: number; revenue: number }>)

    const topCategories = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category: category as Category,
        count: stats.count,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Top marques (produits vendus dans la période actuelle)
    const brandStats = currentPeriodProducts.reduce((acc, product) => {
      const brand = product.brand
      if (!acc[brand]) {
        acc[brand] = { count: 0, revenue: 0 }
      }
      acc[brand].count++
      acc[brand].revenue += product.sellingPrice
      return acc
    }, {} as Record<string, { count: number; revenue: number }>)

    const topBrands = Object.entries(brandStats)
      .map(([brand, stats]) => ({
        brand,
        count: stats.count,
        revenue: stats.revenue,
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Revenus par période (basés sur la période sélectionnée)
    const periodRevenue = []
    const daysDiff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    
    // Adapter le nombre d'intervalles selon la période
    let intervals: number
    if (period === '30d') {
      intervals = Math.min(daysDiff, 7) // 7 points max pour 30 jours (intervalles de ~4 jours)
    } else if (period === '3m') {
      intervals = 3 // Exactement 3 mois
    } else if (period === '6m') {
      intervals = 6 // Exactement 6 mois
    } else {
      intervals = 12 // Exactement 12 mois
    }
    
    if (period === '30d') {
      // Pour 30 jours, diviser en intervalles de jours
      for (let i = 0; i < intervals; i++) {
        const intervalStart = new Date(start.getTime() + (i * daysDiff / intervals) * 24 * 60 * 60 * 1000)
        const intervalEnd = i === intervals - 1 
          ? end 
          : new Date(start.getTime() + ((i + 1) * daysDiff / intervals) * 24 * 60 * 60 * 1000)
        
        const intervalProducts = products.filter(p => 
          p.status === 'SOLD' && 
          p.soldAt && 
          p.soldAt >= intervalStart && 
          p.soldAt <= intervalEnd
        )
        
        const intervalRevenue = intervalProducts.reduce((sum, product) => sum + product.sellingPrice, 0)
        const intervalCost = intervalProducts.reduce((sum, product) => sum + product.purchasePrice, 0)
        
        periodRevenue.push({
          period: intervalEnd.toLocaleDateString('fr-FR', { 
            month: 'short', 
            day: 'numeric'
          }),
          revenue: intervalRevenue,
          profit: intervalRevenue - intervalCost,
        })
      }
    } else {
      // Pour les mois/années, diviser par mois complet
      const currentDate = new Date(start)
      for (let i = 0; i < intervals; i++) {
        const intervalStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const intervalEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999)
        
        // Pour le dernier intervalle, utiliser la date de fin réelle
        const finalIntervalEnd = i === intervals - 1 ? end : intervalEnd
        
        const intervalProducts = products.filter(p => 
          p.status === 'SOLD' && 
          p.soldAt && 
          p.soldAt >= intervalStart && 
          p.soldAt <= finalIntervalEnd
        )
        
        const intervalRevenue = intervalProducts.reduce((sum, product) => sum + product.sellingPrice, 0)
        const intervalCost = intervalProducts.reduce((sum, product) => sum + product.purchasePrice, 0)
        
        periodRevenue.push({
          period: currentDate.toLocaleDateString('fr-FR', { 
            month: 'short',
            year: period === '1y' ? 'numeric' : undefined
          }),
          revenue: intervalRevenue,
          profit: intervalRevenue - intervalCost,
        })
        
        // Passer au mois suivant
        currentDate.setMonth(currentDate.getMonth() + 1)
      }
    }

    const stats = {
      period,
      current: currentStats,
      previous: previousStats,
      variations,
      topCategories,
      topBrands,
      periodRevenue,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
