import { PrismaClient, Category, ProductStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const sampleProducts = [
  // Sneakers
  {
    name: 'Air Jordan 1 Retro High OG',
    description: 'Classique intemporel de Nike, parfait pour les collectionneurs',
    category: Category.SNEAKERS,
    brand: 'Nike',
    size: '42',
    purchasePrice: 120,
    sellingPrice: 180,
    status: ProductStatus.IN_STOCK,
    sku: 'AJ1-RETRO-42',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
  },
  {
    name: 'Yeezy Boost 350 V2',
    description: 'Modèle iconique de Kanye West en collaboration avec Adidas',
    category: Category.SNEAKERS,
    brand: 'Adidas',
    size: '41',
    purchasePrice: 200,
    sellingPrice: 320,
    status: ProductStatus.SOLD,
    sku: 'YZY-350-V2-41',
    imageUrl: 'https://images.unsplash.com/photo-1551107696-a4b0c5a8d935?w=400'
  },
  {
    name: 'Dunk Low Panda',
    description: 'Sneaker tendance Nike avec design noir et blanc',
    category: Category.SNEAKERS,
    brand: 'Nike',
    size: '43',
    purchasePrice: 90,
    sellingPrice: 140,
    status: ProductStatus.RESERVED,
    sku: 'DUNK-PANDA-43',
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400'
  },
  {
    name: 'Chuck Taylor All Star',
    description: 'Classique Converse, intemporel et polyvalent',
    category: Category.SNEAKERS,
    brand: 'Converse',
    size: '40',
    purchasePrice: 45,
    sellingPrice: 75,
    status: ProductStatus.IN_STOCK,
    sku: 'CHUCK-ALLSTAR-40',
    imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400'
  },

  // Vêtements
  {
    name: 'Hoodie Supreme Box Logo',
    description: 'Hoodie iconique Supreme avec logo box rouge',
    category: Category.CLOTHING,
    brand: 'Supreme',
    size: 'L',
    purchasePrice: 150,
    sellingPrice: 280,
    status: ProductStatus.IN_STOCK,
    sku: 'SUP-BOX-L',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400'
  },
  {
    name: 'T-Shirt Off-White Arrows',
    description: 'T-shirt Off-White avec motif flèches signature',
    category: Category.CLOTHING,
    brand: 'Off-White',
    size: 'M',
    purchasePrice: 80,
    sellingPrice: 150,
    status: ProductStatus.SOLD,
    sku: 'OW-ARROWS-M',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400'
  },
  {
    name: 'Jeans Levi\'s 501 Vintage',
    description: 'Jeans vintage Levi\'s 501, coupe classique',
    category: Category.CLOTHING,
    brand: 'Levi\'s',
    size: '32',
    purchasePrice: 60,
    sellingPrice: 95,
    status: ProductStatus.IN_STOCK,
    sku: 'LEVI-501-32',
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400'
  },
  {
    name: 'Bomber Alpha Industries',
    description: 'Bomber militaire Alpha Industries, style vintage',
    category: Category.CLOTHING,
    brand: 'Alpha Industries',
    size: 'XL',
    purchasePrice: 120,
    sellingPrice: 180,
    status: ProductStatus.RESERVED,
    sku: 'ALPHA-BOMBER-XL',
    imageUrl: 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400'
  },

  // Accessoires
  {
    name: 'Casquette New Era Yankees',
    description: 'Casquette New Era officielle des Yankees',
    category: Category.ACCESSORIES,
    brand: 'New Era',
    size: '7 1/4',
    purchasePrice: 25,
    sellingPrice: 45,
    status: ProductStatus.IN_STOCK,
    sku: 'NE-YANKEES-724',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400'
  },
  {
    name: 'Sac à dos Herschel Little America',
    description: 'Sac à dos Herschel Little America, design rétro',
    category: Category.ACCESSORIES,
    brand: 'Herschel',
    size: 'One Size',
    purchasePrice: 80,
    sellingPrice: 130,
    status: ProductStatus.IN_STOCK,
    sku: 'HERS-LA-OS',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400'
  },
  {
    name: 'Montre Casio G-Shock',
    description: 'Montre Casio G-Shock, résistante aux chocs',
    category: Category.ACCESSORIES,
    brand: 'Casio',
    size: 'One Size',
    purchasePrice: 100,
    sellingPrice: 160,
    status: ProductStatus.SOLD,
    sku: 'CASIO-GSHOCK-OS',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'
  },

  // Électronique
  {
    name: 'iPhone 13 Pro Max',
    description: 'iPhone 13 Pro Max 256GB, état excellent',
    category: Category.ELECTRONICS,
    brand: 'Apple',
    size: '256GB',
    purchasePrice: 800,
    sellingPrice: 1100,
    status: ProductStatus.IN_STOCK,
    sku: 'IPHONE-13PM-256',
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400'
  },
  {
    name: 'AirPods Pro 2ème génération',
    description: 'AirPods Pro avec réduction de bruit active',
    category: Category.ELECTRONICS,
    brand: 'Apple',
    size: 'One Size',
    purchasePrice: 200,
    sellingPrice: 280,
    status: ProductStatus.RESERVED,
    sku: 'AIRPODS-PRO-2',
    imageUrl: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400'
  },
  {
    name: 'MacBook Air M2',
    description: 'MacBook Air M2 13 pouces, 8GB RAM, 256GB SSD',
    category: Category.ELECTRONICS,
    brand: 'Apple',
    size: '13"',
    purchasePrice: 1000,
    sellingPrice: 1350,
    status: ProductStatus.IN_STOCK,
    sku: 'MBA-M2-13-256',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'
  },

  // Collection
  {
    name: 'Funko Pop Batman',
    description: 'Figurine Funko Pop Batman édition limitée',
    category: Category.COLLECTIBLES,
    brand: 'Funko',
    size: 'Standard',
    purchasePrice: 15,
    sellingPrice: 35,
    status: ProductStatus.IN_STOCK,
    sku: 'FUNKO-BATMAN-STD',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'
  },
  {
    name: 'Lego Creator Expert',
    description: 'Set Lego Creator Expert, modèle vintage',
    category: Category.COLLECTIBLES,
    brand: 'Lego',
    size: 'Standard',
    purchasePrice: 80,
    sellingPrice: 120,
    status: ProductStatus.SOLD,
    sku: 'LEGO-CREATOR-EXP',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'
  },
  {
    name: 'Carte Pokémon Charizard',
    description: 'Carte Pokémon Charizard édition première',
    category: Category.COLLECTIBLES,
    brand: 'Pokémon',
    size: 'Standard',
    purchasePrice: 200,
    sellingPrice: 350,
    status: ProductStatus.RESERVED,
    sku: 'PKM-CHARIZARD-1ST',
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400'
  },

  // Autre
  {
    name: 'Skateboard Supreme',
    description: 'Skateboard Supreme avec graphisme exclusif',
    category: Category.OTHER,
    brand: 'Supreme',
    size: '8.25"',
    purchasePrice: 60,
    sellingPrice: 120,
    status: ProductStatus.IN_STOCK,
    sku: 'SUP-SKATE-825',
    imageUrl: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400'
  },
  {
    name: 'Planche de surf Channel Islands',
    description: 'Planche de surf Channel Islands, modèle pro',
    category: Category.OTHER,
    brand: 'Channel Islands',
    size: '6\'0"',
    purchasePrice: 400,
    sellingPrice: 650,
    status: ProductStatus.IN_STOCK,
    sku: 'CI-SURF-60',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400'
  }
]

async function main() {
  console.log('🌱 Début du seeding...')

  // Créer un utilisateur de test
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      name: 'Utilisateur Test',
      password: hashedPassword,
      role: 'USER',
    },
  })

  console.log(`👤 Utilisateur créé: ${user.email}`)

  // Supprimer les produits existants pour cet utilisateur
  await prisma.product.deleteMany({
    where: { userId: user.id }
  })

  // Créer les produits d'exemple
  for (const productData of sampleProducts) {
    const product = await prisma.product.create({
      data: {
        ...productData,
        userId: user.id,
      },
    })
    console.log(`📦 Produit créé: ${product.name}`)
  }

  console.log('✅ Seeding terminé!')
  console.log(`📊 ${sampleProducts.length} produits créés pour l'utilisateur ${user.email}`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
