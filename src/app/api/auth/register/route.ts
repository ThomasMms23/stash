import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signUpSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = signUpSchema.parse(body)

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Un compte avec cet email existe déjà' },
        { status: 400 }
      )
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12)

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER',
      },
    })

    // Retourner l'utilisateur sans le mot de passe
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json(
      { 
        message: 'Compte créé avec succès',
        user: userWithoutPassword 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      // Retourner le premier message d'erreur de validation
      const zodError = error as any
      const firstError = zodError.errors?.[0]
      return NextResponse.json(
        { message: firstError?.message || 'Données invalides' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
