'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createProductSchema, CreateProductInput } from '@/lib/validations'
import { Category } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ui/image-upload'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

interface ProductFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  product?: any
}

const categories = [
  { value: Category.SNEAKERS, label: 'Sneakers' },
  { value: Category.CLOTHING, label: 'Vêtements' },
  { value: Category.ACCESSORIES, label: 'Accessoires' },
  { value: Category.ELECTRONICS, label: 'Électronique' },
  { value: Category.COLLECTIBLES, label: 'Collection' },
  { value: Category.OTHER, label: 'Autre' },
]

export function ProductForm({ open, onOpenChange, onSuccess, product }: ProductFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!product

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductSchema),
  })

  // Réinitialiser le formulaire quand le produit change
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        category: product.category,
        brand: product.brand,
        size: product.size || '',
        purchasePrice: product.purchasePrice,
        sellingPrice: product.sellingPrice,
        imageUrl: product.imageUrl || '',
        sku: product.sku || '',
      })
    } else {
      reset({
        name: '',
        description: '',
        category: Category.SNEAKERS,
        brand: '',
        size: '',
        purchasePrice: 0,
        sellingPrice: 0,
        imageUrl: '',
        sku: '',
      })
    }
  }, [product, reset])

  const onSubmit = async (data: CreateProductInput) => {
    setIsLoading(true)
    try {
      const url = isEditing ? `/api/products/${product.id}` : '/api/products'
      const method = isEditing ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        toast.success(isEditing ? 'Produit mis à jour' : 'Produit créé avec succès')
        reset()
        onOpenChange(false)
        onSuccess?.()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Une erreur est survenue')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset()
    }
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Modifier le produit' : 'Ajouter un produit'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Modifiez les informations du produit' 
              : 'Ajoutez un nouveau produit à votre inventaire'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom du produit *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Ex: Air Jordan 1 Retro"
                disabled={isLoading}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Marque *</Label>
              <Input
                id="brand"
                {...register('brand')}
                placeholder="Ex: Nike"
                disabled={isLoading}
              />
              {errors.brand && (
                <p className="text-sm text-destructive">{errors.brand.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Description du produit..."
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select
                value={watch('category')}
                onValueChange={(value) => setValue('category', value as Category)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Taille</Label>
              <Input
                id="size"
                {...register('size')}
                placeholder="Ex: 42, M, L..."
                disabled={isLoading}
              />
              {errors.size && (
                <p className="text-sm text-destructive">{errors.size.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Prix d'achat (€) *</Label>
              <Input
                id="purchasePrice"
                type="number"
                step="0.01"
                {...register('purchasePrice', { valueAsNumber: true })}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.purchasePrice && (
                <p className="text-sm text-destructive">{errors.purchasePrice.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sellingPrice">Prix de vente (€) *</Label>
              <Input
                id="sellingPrice"
                type="number"
                step="0.01"
                {...register('sellingPrice', { valueAsNumber: true })}
                placeholder="0.00"
                disabled={isLoading}
              />
              {errors.sellingPrice && (
                <p className="text-sm text-destructive">{errors.sellingPrice.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                {...register('sku')}
                placeholder="Code produit unique"
                disabled={isLoading}
              />
              {errors.sku && (
                <p className="text-sm text-destructive">{errors.sku.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <ImageUpload
              value={watch('imageUrl')}
              onChange={(url) => setValue('imageUrl', url)}
              disabled={isLoading}
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive">{errors.imageUrl.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
