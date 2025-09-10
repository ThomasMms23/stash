import { PrismaClient, NotificationType } from '@prisma/client'
import { hash } from 'bcryptjs'

// Import des enums depuis le schema Prisma
const UserRole = {
  USER: 'USER',
  ADMIN: 'ADMIN'
} as const

const ProductStatus = {
  IN_STOCK: 'IN_STOCK',
  SOLD: 'SOLD',
  RESERVED: 'RESERVED'
} as const

const Category = {
  SNEAKERS: 'SNEAKERS',
  CLOTHING: 'CLOTHING',
  ACCESSORIES: 'ACCESSORIES',
  ELECTRONICS: 'ELECTRONICS',
  COLLECTIBLES: 'COLLECTIBLES',
  OTHER: 'OTHER'
} as const

const prisma = new PrismaClient()

async function seedDemoData() {
  try {
    console.log('🌱 Initialisation des données démo...')

    // 1. Créer l'utilisateur démo
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@stash.app' },
      update: {},
      create: {
        email: 'demo@stash.app',
        name: 'Utilisateur Démo',
        password: await hash('demo123', 12),
        role: UserRole.USER,
        emailVerified: new Date(),
      },
    })

    console.log('✅ Utilisateur démo créé:', demoUser.email)

    // 2. Supprimer les anciens produits démo
    await prisma.product.deleteMany({
      where: { userId: demoUser.id }
    })

    // 3. Créer les produits démo avec données réalistes et réparties dans le temps
    const now = new Date()
    const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
    
    // Fonction pour générer une date aléatoire dans une période donnée
    const randomDate = (start: Date, end: Date) => {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    }

    // Fonction pour générer une date de vente réaliste (produit vendu après sa création)
    const randomSoldDate = (createdAt: Date, end: Date = now) => {
      return randomDate(createdAt, end)
    }

    const demoProducts = [
      // SNEAKERS - Réparties sur l'année
      {
        name: 'Air Jordan 1 Retro High OG Chicago',
        description: 'Iconic sneaker, classic colorway.',
        category: Category.SNEAKERS,
        brand: 'Nike',
        size: 'US 10',
        purchasePrice: 180,
        sellingPrice: 320,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'AJ1-CHI-10',
        userId: demoUser.id,
      },
      {
        name: 'Yeezy Boost 350 V2 Beluga',
        description: 'Kanye West designed sneaker.',
        category: Category.SNEAKERS,
        brand: 'Adidas',
        size: 'US 9',
        purchasePrice: 220,
        sellingPrice: 380,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'YB350-BEL-9',
        userId: demoUser.id,
      },
      {
        name: 'Travis Scott Jordan 1 Low',
        description: 'Collaboration Travis Scott x Nike.',
        category: Category.SNEAKERS,
        brand: 'Nike',
        size: 'US 11',
        purchasePrice: 280,
        sellingPrice: 450,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'TS-J1-LOW-11',
        userId: demoUser.id,
      },
      {
        name: 'Dunk Low Panda',
        description: 'Classic Nike Dunk Low in black and white.',
        category: Category.SNEAKERS,
        brand: 'Nike',
        size: 'US 8.5',
        purchasePrice: 120,
        sellingPrice: 200,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'DUNK-PANDA-8.5',
        userId: demoUser.id,
      },
      {
        name: 'New Balance 550 White',
        description: 'Retro basketball-inspired sneaker.',
        category: Category.SNEAKERS,
        brand: 'New Balance',
        size: 'US 9.5',
        purchasePrice: 90,
        sellingPrice: 160,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'NB550-WHT-9.5',
        userId: demoUser.id,
      },
      {
        name: 'Air Force 1 White',
        description: 'Classic all-white Air Force 1.',
        category: Category.SNEAKERS,
        brand: 'Nike',
        size: 'US 10.5',
        purchasePrice: 100,
        sellingPrice: 180,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'AF1-WHT-10.5',
        userId: demoUser.id,
      },

      // CLOTHING - Réparties sur l'année
      {
        name: 'Supreme Box Logo Hoodie FW23',
        description: 'Limited edition Supreme hoodie.',
        category: Category.CLOTHING,
        brand: 'Supreme',
        size: 'L',
        purchasePrice: 180,
        sellingPrice: 320,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'SUP-BOGO-L',
        userId: demoUser.id,
      },
      {
        name: 'Off-White Caravaggio Hoodie',
        description: 'High-end streetwear hoodie.',
        category: Category.CLOTHING,
        brand: 'Off-White',
        size: 'M',
        purchasePrice: 350,
        sellingPrice: 580,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'OW-CARA-M',
        userId: demoUser.id,
      },
      {
        name: 'Palace Tri-Ferg Tee',
        description: 'Classic Palace graphic tee.',
        category: Category.CLOTHING,
        brand: 'Palace',
        size: 'M',
        purchasePrice: 45,
        sellingPrice: 85,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'PAL-TRI-M',
        userId: demoUser.id,
      },
      {
        name: 'Stüssy World Tour Hoodie',
        description: 'Vintage-inspired Stüssy hoodie.',
        category: Category.CLOTHING,
        brand: 'Stüssy',
        size: 'L',
        purchasePrice: 80,
        sellingPrice: 140,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'STU-WT-L',
        userId: demoUser.id,
      },
      {
        name: 'Bape Shark Hoodie',
        description: 'Iconic Bape shark face hoodie.',
        category: Category.CLOTHING,
        brand: 'Bape',
        size: 'M',
        purchasePrice: 200,
        sellingPrice: 350,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'BAPE-SHARK-M',
        userId: demoUser.id,
      },

      // ELECTRONICS - Réparties sur l'année
      {
        name: 'iPhone 14 Pro',
        description: 'Apple smartphone, excellent condition.',
        category: Category.ELECTRONICS,
        brand: 'Apple',
        size: '128GB',
        purchasePrice: 280,
        sellingPrice: 420,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'IP14P-128',
        userId: demoUser.id,
      },
      {
        name: 'PlayStation 5',
        description: 'Next-gen gaming console.',
        category: Category.ELECTRONICS,
        brand: 'Sony',
        size: '1TB',
        purchasePrice: 500,
        sellingPrice: 650,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'PS5-1TB',
        userId: demoUser.id,
      },
      {
        name: 'MacBook Air M2',
        description: 'Apple laptop, lightly used.',
        category: Category.ELECTRONICS,
        brand: 'Apple',
        size: '256GB',
        purchasePrice: 350,
        sellingPrice: 520,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'MBA-M2-256',
        userId: demoUser.id,
      },
      {
        name: 'AirPods Pro 2nd Gen',
        description: 'Apple wireless earbuds.',
        category: Category.ELECTRONICS,
        brand: 'Apple',
        size: 'Standard',
        purchasePrice: 80,
        sellingPrice: 140,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'APP-2ND',
        userId: demoUser.id,
      },
      {
        name: 'Nintendo Switch OLED',
        description: 'Portable gaming console.',
        category: Category.ELECTRONICS,
        brand: 'Nintendo',
        size: '64GB',
        purchasePrice: 200,
        sellingPrice: 320,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'NSW-OLED-64',
        userId: demoUser.id,
      },

      // ACCESSORIES - Réparties sur l'année
      {
        name: 'Goyard Card Holder',
        description: 'Luxury leather card holder.',
        category: Category.ACCESSORIES,
        brand: 'Goyard',
        size: 'Standard',
        purchasePrice: 120,
        sellingPrice: 200,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'GOY-CARD',
        userId: demoUser.id,
      },
      {
        name: 'Supreme Waist Bag',
        description: 'Streetwear waist bag.',
        category: Category.ACCESSORIES,
        brand: 'Supreme',
        size: 'One Size',
        purchasePrice: 60,
        sellingPrice: 110,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'SUP-WAIST',
        userId: demoUser.id,
      },
      {
        name: 'Louis Vuitton Keychain',
        description: 'Luxury keychain accessory.',
        category: Category.ACCESSORIES,
        brand: 'Louis Vuitton',
        size: 'Standard',
        purchasePrice: 80,
        sellingPrice: 140,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'LV-KEY',
        userId: demoUser.id,
      },
      {
        name: 'Off-White Belt',
        description: 'Industrial design belt.',
        category: Category.ACCESSORIES,
        brand: 'Off-White',
        size: 'L',
        purchasePrice: 90,
        sellingPrice: 160,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'OW-BELT-L',
        userId: demoUser.id,
      },

      // COLLECTIBLES - Réparties sur l'année
      {
        name: 'Funko Pop Travis Scott',
        description: 'Limited edition Funko Pop figure.',
        category: Category.COLLECTIBLES,
        brand: 'Funko',
        size: 'Standard',
        purchasePrice: 25,
        sellingPrice: 45,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'FUNKO-TS',
        userId: demoUser.id,
      },
      {
        name: 'Supreme Brick',
        description: 'Iconic Supreme brick collectible.',
        category: Category.COLLECTIBLES,
        brand: 'Supreme',
        size: 'Standard',
        purchasePrice: 30,
        sellingPrice: 80,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'SUP-BRICK',
        userId: demoUser.id,
      },
      {
        name: 'Pokémon Card Charizard',
        description: 'Rare Pokémon trading card.',
        category: Category.COLLECTIBLES,
        brand: 'Pokémon',
        size: 'Standard',
        purchasePrice: 50,
        sellingPrice: 120,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'PKM-CHAR',
        userId: demoUser.id,
      },

      // Produits récents (derniers mois)
      {
        name: 'Yeezy 700 Wave Runner',
        description: 'Chunky dad shoe design.',
        category: Category.SNEAKERS,
        brand: 'Adidas',
        size: 'US 10',
        purchasePrice: 200,
        sellingPrice: 350,
        status: ProductStatus.RESERVED,
        soldAt: null,
        sku: 'Y700-WR-10',
        userId: demoUser.id,
      },
      {
        name: 'Fear of God Essentials Hoodie',
        description: 'Minimalist streetwear hoodie.',
        category: Category.CLOTHING,
        brand: 'Fear of God',
        size: 'M',
        purchasePrice: 120,
        sellingPrice: 200,
        status: ProductStatus.IN_STOCK,
        soldAt: null,
        sku: 'FOG-ESS-M',
        userId: demoUser.id,
      },
      {
        name: 'iPad Air 5th Gen',
        description: 'Apple tablet, excellent condition.',
        category: Category.ELECTRONICS,
        brand: 'Apple',
        size: '64GB',
        purchasePrice: 180,
        sellingPrice: 280,
        status: ProductStatus.SOLD,
        soldAt: new Date(), // Sera remplacé par une date réaliste
        sku: 'IPAD-AIR-64',
        userId: demoUser.id,
      },
    ]

    for (const productData of demoProducts) {
      // Générer une date de création aléatoire sur l'année écoulée
      const createdAt = randomDate(oneYearAgo, now)
      
      // Si le produit est vendu, générer une date de vente réaliste (après la création)
      let soldAt = productData.soldAt
      if (productData.status === 'SOLD' && productData.soldAt) {
        soldAt = randomSoldDate(createdAt, now)
      }
      
      await prisma.product.create({
        data: {
          ...productData,
          createdAt,
          soldAt,
        },
      })
    }

    console.log('✅ Produits démo créés:', demoProducts.length)

    // 4. Créer des notifications démo mises à jour
    const demoNotifications = [
      {
        title: 'Stock faible',
        message: 'Yeezy Boost 350 V2 Beluga - Stock faible (1 unité restante)',
        type: NotificationType.LOW_STOCK,
        userId: demoUser.id,
        isRead: false,
      },
      {
        title: 'Nouveau produit ajouté',
        message: 'Yeezy 700 Wave Runner ajouté à votre inventaire',
        type: NotificationType.NEW_PRODUCT,
        userId: demoUser.id,
        isRead: false,
      },
      {
        title: 'Vente finalisée',
        message: 'iPad Air 5th Gen vendu pour 280€',
        type: NotificationType.SALE_COMPLETED,
        userId: demoUser.id,
        isRead: true,
      },
      {
        title: 'Vente finalisée',
        message: 'Off-White Caravaggio Hoodie vendu pour 580€',
        type: NotificationType.SALE_COMPLETED,
        userId: demoUser.id,
        isRead: true,
      },
      {
        title: 'Nouveau produit ajouté',
        message: 'Fear of God Essentials Hoodie ajouté à votre inventaire',
        type: NotificationType.NEW_PRODUCT,
        userId: demoUser.id,
        isRead: false,
      },
    ]

    for (const notificationData of demoNotifications) {
      await prisma.notification.create({
        data: notificationData,
      })
    }

    console.log('✅ Notifications démo créées:', demoNotifications.length)

    // 5. Créer les préférences de notifications démo
    await prisma.notificationPreferences.upsert({
      where: { userId: demoUser.id },
      update: {},
      create: {
        userId: demoUser.id,
        lowStockEnabled: true,
        newProductEnabled: true,
        saleCompletedEnabled: true,
        emailEnabled: false,
      },
    })

    console.log('✅ Préférences de notifications démo créées')

    console.log('🎉 Données démo initialisées avec succès!')
    console.log('📧 Email: demo@stash.app')
    console.log('🔑 Mot de passe: demo123')

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation des données démo:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedDemoData()
