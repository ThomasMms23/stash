import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const userId = session.user.id

    // Récupérer tous les produits de l'utilisateur
    const products = await prisma.product.findMany({
      where: { userId },
      include: { transactions: true },
    })

    // Calculer les statistiques totales
    const totalProducts = products.length
    const soldProducts = products.filter(p => p.status === 'SOLD')
    const totalSales = soldProducts.length
    
    // Calculer le chiffre d'affaires total
    const totalRevenue = soldProducts.reduce((sum, product) => {
      return sum + product.sellingPrice
    }, 0)

    // Calculer la marge moyenne
    let averageMargin = 0
    if (soldProducts.length > 0) {
      const totalMargin = soldProducts.reduce((sum, product) => {
        const margin = product.sellingPrice - product.purchasePrice
        return sum + margin
      }, 0)
      averageMargin = (totalMargin / soldProducts.length) / (totalRevenue / soldProducts.length) * 100
    }

    // Calculer le bénéfice total
    const totalProfit = soldProducts.reduce((sum, product) => {
      return sum + (product.sellingPrice - product.purchasePrice)
    }, 0)

    // Calculer la valeur du stock actuel
    const inStockProducts = products.filter(p => p.status === 'IN_STOCK')
    const stockValue = inStockProducts.reduce((sum, product) => {
      return sum + product.purchasePrice
    }, 0)

    // Calculer la valeur potentielle du stock
    const potentialStockValue = inStockProducts.reduce((sum, product) => {
      return sum + product.sellingPrice
    }, 0)

    return NextResponse.json({
      totalProducts,
      totalSales,
      totalRevenue,
      totalProfit,
      averageMargin,
      stockValue,
      potentialStockValue,
      inStockCount: inStockProducts.length,
      reservedCount: products.filter(p => p.status === 'RESERVED').length,
    })

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques utilisateur:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
