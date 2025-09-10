import { PrismaClient } from '@prisma/client'
import { getPeriodDates } from '../src/lib/period-utils'

const prisma = new PrismaClient()

async function testFullAPI() {
  try {
    console.log('Test complet de l\'API dashboard...')
    
    const userId = 'cmfbvyp380000ykw61ijb9bwq' // ID utilisateur correct
    const period = '30d'
    
    // Simuler exactement ce que fait l'API
    const { start, end, previousStart, previousEnd } = getPeriodDates(period)
    
    console.log(`\nPériode ${period}:`)
    console.log(`- Actuelle: ${start.toISOString()} à ${end.toISOString()}`)
    console.log(`- Précédente: ${previousStart.toISOString()} à ${previousEnd.toISOString()}`)
    
    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      where: { userId },
      include: { transactions: true },
    })
    
    console.log(`\nTotal produits: ${products.length}`)
    
    // Filtrer les produits vendus dans la période actuelle
    const currentPeriodProducts = products.filter(p => 
      p.status === 'SOLD' && 
      p.soldAt && 
      p.soldAt >= start && 
      p.soldAt <= end
    )
    
    console.log(`Produits vendus dans la période actuelle: ${currentPeriodProducts.length}`)
    currentPeriodProducts.forEach(p => {
      console.log(`- ${p.name}: ${p.soldAt?.toISOString()}`)
    })
    
    // Filtrer les produits vendus dans la période précédente
    const previousPeriodProducts = products.filter(p => 
      p.status === 'SOLD' && 
      p.soldAt && 
      p.soldAt >= previousStart && 
      p.soldAt <= previousEnd
    )
    
    console.log(`Produits vendus dans la période précédente: ${previousPeriodProducts.length}`)
    
    // Calculer les statistiques
    const currentStats = {
      totalProducts: products.length,
      totalSales: currentPeriodProducts.length,
      totalRevenue: currentPeriodProducts.reduce((sum, product) => sum + product.sellingPrice, 0),
      totalCost: currentPeriodProducts.reduce((sum, product) => sum + product.purchasePrice, 0),
      totalProfit: 0, // Sera calculé ci-dessous
    }
    currentStats.totalProfit = currentStats.totalRevenue - currentStats.totalCost
    
    console.log(`\nStatistiques actuelles:`)
    console.log(`- Total produits: ${currentStats.totalProducts}`)
    console.log(`- Ventes: ${currentStats.totalSales}`)
    console.log(`- Revenus: ${currentStats.totalRevenue}€`)
    console.log(`- Bénéfices: ${currentStats.totalProfit}€`)
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFullAPI()
