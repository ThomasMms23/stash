import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createProductSchema, productFiltersSchema, paginationSchema } from '@/lib/validations'
import { notifyNewProduct } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = productFiltersSchema.parse({
      search: searchParams.get('search') || undefined,
      category: searchParams.get('category') || undefined,
      brand: searchParams.get('brand') || undefined,
      status: searchParams.get('status') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    })

    const pagination = paginationSchema.parse({
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: searchParams.get('sortOrder') || undefined,
    })

    const where = {
      userId: session.user.id,
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search } },
          { brand: { contains: filters.search } },
          { sku: { contains: filters.search } },
        ],
      }),
      ...(filters.category && filters.category !== 'all' && { category: filters.category }),
      ...(filters.brand && { brand: filters.brand }),
      ...(filters.status && filters.status !== 'all' && { status: filters.status }),
      ...(filters.minPrice && { sellingPrice: { gte: filters.minPrice } }),
      ...(filters.maxPrice && { sellingPrice: { lte: filters.maxPrice } }),
    }

    const orderBy: any = pagination.sortBy 
      ? { [pagination.sortBy]: pagination.sortOrder }
      : { createdAt: 'desc' }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (pagination.page - 1) * pagination.limit,
        take: pagination.limit,
        include: {
          transactions: true,
        },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      data: products,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
        hasNext: pagination.page < Math.ceil(total / pagination.limit),
        hasPrev: pagination.page > 1,
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const body = await request.json()
    const data = createProductSchema.parse(body)

    const product = await prisma.product.create({
      data: {
        ...data,
        // Convertir les chaînes vides en null pour éviter les contraintes d'unicité
        sku: data.sku && data.sku.trim() !== '' ? data.sku.trim() : null,
        userId: session.user.id,
      },
      include: {
        transactions: true,
      },
    })

    // Créer une notification pour le nouveau produit
    await notifyNewProduct(session.user.id, product.name, product.id)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { message: 'Données invalides' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
