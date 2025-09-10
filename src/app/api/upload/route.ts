import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Non autorisé' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ message: 'Aucun fichier fourni' }, { status: 400 })
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: 'Type de fichier non autorisé' },
        { status: 400 }
      )
    }

    // Vérifier la taille du fichier (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { message: 'Fichier trop volumineux (max 5MB)' },
        { status: 400 }
      )
    }

    // Générer un nom de fichier unique
    const fileExt = file.name.split('.').pop()
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

    // Convertir le fichier en buffer
    const fileBuffer = await file.arrayBuffer()

    // Upload vers Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('product-images')
      .upload(fileName, fileBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json(
        { message: 'Erreur lors de l\'upload' },
        { status: 500 }
      )
    }

    // Obtenir l'URL publique
    const { data: urlData } = supabaseAdmin.storage
      .from('product-images')
      .getPublicUrl(data.path)

    return NextResponse.json({
      url: urlData.publicUrl,
      path: data.path,
    })
  } catch (error) {
    console.error('Erreur lors de l\'upload:', error)
    return NextResponse.json(
      { message: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
