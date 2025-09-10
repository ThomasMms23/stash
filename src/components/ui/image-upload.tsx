'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Upload, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onChange(data.url)
        toast.success('Image uploadée avec succès')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de l\'upload')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemoveImage = () => {
    onChange('')
  }

  const handleClick = () => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className="space-y-2">
      <Label>Image du produit (optionnel)</Label>
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={value || ''} alt="Image du produit" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
            {isUploading ? (
              <Loader2 className="h-8 w-8 animate-spin" />
            ) : (
              'PR'
            )}
          </AvatarFallback>
        </Avatar>
        
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClick}
            disabled={disabled || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                {value ? 'Changer l\'image' : 'Ajouter une image'}
              </>
            )}
          </Button>
          
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled || isUploading}
            >
              <X className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>
      
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      
      <p className="text-xs text-muted-foreground">
        Formats acceptés: JPG, PNG, WebP. Taille max: 5MB. L'image est optionnelle.
      </p>
    </div>
  )
}
