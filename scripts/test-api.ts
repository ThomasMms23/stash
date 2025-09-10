import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testAPI() {
  try {
    console.log('Test de l\'API dashboard...')
    
    // Récupérer tous les produits
    const products = await prisma.product.findMany({
      where: { 
        userId: 'cmfbvyp380000ykw61ijb9bwq' // ID utilisateur correct
      },
      include: { transactions: true },
    })
    
    console.log(`Total produits: ${products.length}`)
    
    // Produits vendus
    const soldProducts = products.filter(p => p.status === 'SOLD')
    console.log(`Produits vendus: ${soldProducts.length}`)
    
    // Vérifier les dates soldAt
    soldProducts.forEach(product => {
      console.log(`- ${product.name}: soldAt = ${product.soldAt} (type: ${typeof product.soldAt})`)
    })
    
    // Test de filtrage par date (30 derniers jours)
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    
    console.log(`\nFiltrage par période:`)
    console.log(`- Maintenant: ${now.toISOString()}`)
    console.log(`- Il y a 30 jours: ${thirtyDaysAgo.toISOString()}`)
    
    const currentPeriodProducts = products.filter(p => 
      p.status === 'SOLD' && 
      p.soldAt && 
      p.soldAt >= thirtyDaysAgo && 
      p.soldAt <= now
    )
    
    console.log(`Produits vendus dans les 30 derniers jours: ${currentPeriodProducts.length}`)
    
  } catch (error) {
    console.error('Erreur:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testAPI()
