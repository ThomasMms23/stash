import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function redistributeSales() {
  try {
    console.log('Redistribution des ventes sur plusieurs mois...')
    
    // Récupérer tous les produits vendus
    const soldProducts = await prisma.product.findMany({
      where: {
        status: 'SOLD',
        soldAt: { not: null }
      }
    })
    
    console.log(`${soldProducts.length} produits vendus trouvés`)
    
    // Redistribuer les ventes sur les 6 derniers mois
    const months = [
      { month: 3, day: 15 }, // Mars
      { month: 4, day: 8 },  // Avril  
      { month: 5, day: 22 }, // Mai
      { month: 6, day: 5 },  // Juin
      { month: 7, day: 18 }, // Juillet
      { month: 8, day: 2 },  // Août
      { month: 8, day: 25 }, // Août (2ème vente)
      { month: 9, day: 7 },  // Septembre
      { month: 9, day: 9 },  // Septembre (aujourd'hui)
    ]
    
    for (let i = 0; i < soldProducts.length; i++) {
      const product = soldProducts[i]
      const monthData = months[i] || months[months.length - 1] // Utiliser le dernier mois si plus de produits
      
      // Créer une date en 2025
      const newSaleDate = new Date(2025, monthData.month - 1, monthData.day, 
        Math.floor(Math.random() * 12) + 8, // Heure entre 8h et 20h
        Math.floor(Math.random() * 60),     // Minutes aléatoires
        Math.floor(Math.random() * 60)      // Secondes aléatoires
      )
      
      await prisma.product.update({
        where: { id: product.id },
        data: { soldAt: newSaleDate }
      })
      
      console.log(`${product.name}: ${newSaleDate.toLocaleDateString('fr-FR')} ${newSaleDate.toLocaleTimeString('fr-FR')}`)
    }
    
    console.log('\n✅ Redistribution terminée!')
    console.log('\n📊 Maintenant vous devriez voir:')
    console.log('- 30 derniers jours: 2-3 ventes')
    console.log('- 3 derniers mois: 4-5 ventes') 
    console.log('- 6 derniers mois: 6-7 ventes')
    console.log('- 1 an: toutes les ventes')
    
  } catch (error) {
    console.error('Erreur lors de la redistribution:', error)
  } finally {
    await prisma.$disconnect()
  }
}

redistributeSales()
