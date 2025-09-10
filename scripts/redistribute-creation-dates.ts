import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function redistributeCreationDates() {
  console.log('Redistribution des dates de création sur plusieurs mois...')

  const products = await prisma.product.findMany({
    orderBy: {
      createdAt: 'asc',
    },
  })

  if (products.length === 0) {
    console.log('Aucun produit trouvé.')
    return
  }

  console.log(`${products.length} produits trouvés`)

  // Créer des dates de création réparties sur plusieurs mois
  const creationDates = [
    new Date('2024-12-15T10:30:00Z'), // Décembre 2024
    new Date('2025-01-08T14:20:00Z'), // Janvier 2025
    new Date('2025-01-22T09:15:00Z'), // Janvier 2025
    new Date('2025-02-05T16:45:00Z'), // Février 2025
    new Date('2025-02-18T11:30:00Z'), // Février 2025
    new Date('2025-03-12T13:20:00Z'), // Mars 2025
    new Date('2025-03-25T08:45:00Z'), // Mars 2025
    new Date('2025-04-03T15:10:00Z'), // Avril 2025
    new Date('2025-04-17T12:35:00Z'), // Avril 2025
    new Date('2025-05-08T09:25:00Z'), // Mai 2025
    new Date('2025-05-21T14:50:00Z'), // Mai 2025
    new Date('2025-06-02T11:15:00Z'), // Juin 2025
    new Date('2025-06-16T16:30:00Z'), // Juin 2025
    new Date('2025-07-05T10:20:00Z'), // Juillet 2025
    new Date('2025-07-19T13:45:00Z'), // Juillet 2025
    new Date('2025-08-01T08:30:00Z'), // Août 2025
    new Date('2025-08-14T15:25:00Z'), // Août 2025
    new Date('2025-08-28T12:10:00Z'), // Août 2025
  ]

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const newCreatedAt = creationDates[i % creationDates.length] // Cycle through dates if more products than dates

    await prisma.product.update({
      where: { id: product.id },
      data: { createdAt: newCreatedAt },
    })
    console.log(`${product.name}: ${newCreatedAt.toLocaleString('fr-FR')}`)
  }

  console.log('\n✅ Redistribution des dates de création terminée!')
  console.log('\n📊 Maintenant vous devriez voir:')
  console.log('- 30 derniers jours: 2-3 nouveaux produits')
  console.log('- 3 derniers mois: 8-10 nouveaux produits')
  console.log('- 6 derniers mois: 12-15 nouveaux produits')
  console.log('- 1 an: tous les produits')
}

redistributeCreationDates()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
