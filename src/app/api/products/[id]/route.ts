import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { updateProductSchema } from '@/lib/validations'
import { notifySaleCompleted } from '@/lib/notifications'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        transactions: true,
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Erreur lors de la récupération du produit:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)

    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        // Convertir les chaînes vides en null pour éviter les contraintes d'unicité
        sku: data.sku && data.sku.trim() !== '' ? data.sku.trim() : null,
      },
      include: {
        transactions: true,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    
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

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const data = updateProductSchema.parse(body)

    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    // Gérer automatiquement le champ soldAt
    const updateData = { ...data }
    
    // Si le statut passe à SOLD et qu'il n'y a pas encore de soldAt, définir la date actuelle
    if (data.status === 'SOLD' && !product.soldAt) {
      updateData.soldAt = new Date()
      
      // Créer une notification pour la vente
      await notifySaleCompleted(session.user.id, product.name, product.sellingPrice)
    }
    
    // Si le statut passe à autre chose que SOLD, effacer soldAt
    if (data.status !== 'SOLD' && product.soldAt) {
      updateData.soldAt = null
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        transactions: true,
      },
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Erreur lors de la mise à jour du produit:', error)
    
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

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const { id } = await params
    const product = await prisma.product.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!product) {
      return NextResponse.json({ message: 'Produit non trouvé' }, { status: 404 })
    }

    await prisma.product.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Produit supprimé avec succès' })
  } catch (error) {
    console.error('Erreur lors de la suppression du produit:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
