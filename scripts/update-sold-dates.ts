import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function updateSoldDates() {
  try {
    console.log('Mise à jour des dates de vente pour les produits vendus...')
    
    // Récupérer tous les produits vendus sans date de vente
    const soldProducts = await prisma.product.findMany({
      where: {
        status: 'SOLD',
        soldAt: null
      }
    })
    
    console.log(`${soldProducts.length} produits vendus trouvés sans date de vente`)
    
    // Mettre à jour chaque produit avec une date de vente simulée
    for (const product of soldProducts) {
      // Générer une date de vente aléatoire dans les 30 derniers jours
      const now = new Date()
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      const randomTime = thirtyDaysAgo.getTime() + Math.random() * (now.getTime() - thirtyDaysAgo.getTime())
      const randomDate = new Date(randomTime)
      
      await prisma.product.update({
        where: { id: product.id },
        data: { soldAt: randomDate }
      })
      
      console.log(`Produit ${product.name} mis à jour avec la date: ${randomDate.toISOString()}`)
    }
    
    console.log('Mise à jour terminée avec succès!')
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateSoldDates()
