'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductStatus, Category } from '@prisma/client'

type Product = {
  id: string
  name: string
  description: string | null
  category: Category
  brand: string
  size: string | null
  purchasePrice: number
  sellingPrice: number
  status: ProductStatus
  soldAt: Date | null
  imageUrl: string | null
  sku: string | null
  createdAt: Date
  updatedAt: Date
  userId: string
}
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ProductStatusBadge } from '@/components/ui/product-status-badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Calendar,
  Tag,
  Ruler,
  Image as ImageIcon,
  TrendingUp
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/period-utils'

const categoryLabels = {
  [Category.SNEAKERS]: 'Sneakers',
  [Category.CLOTHING]: 'Vêtements',
  [Category.ACCESSORIES]: 'Accessoires',
  [Category.ELECTRONICS]: 'Électronique',
  [Category.COLLECTIBLES]: 'Collection',
  [Category.OTHER]: 'Autre',
}

const statusLabels = {
  [ProductStatus.IN_STOCK]: 'En stock',
  [ProductStatus.SOLD]: 'Vendu',
  [ProductStatus.RESERVED]: 'Réservé',
}

export default function ProductDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProduct(data)
        } else {
          toast.error('Produit non trouvé')
          router.push('/dashboard/products')
        }
      } catch (error) {
        toast.error('Erreur lors du chargement du produit')
        router.push('/dashboard/products')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id, router])

  const handleStatusChange = async (newStatus: ProductStatus) => {
    if (!product) return

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        setProduct({ ...product, status: newStatus })
        toast.success('Statut mis à jour avec succès')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  const handleDelete = async () => {
    if (!product) return

    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Produit supprimé avec succès')
        router.push('/dashboard/products')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  const calculateMargin = (purchasePrice: number, sellingPrice: number) => {
    return sellingPrice - purchasePrice
  }

  const calculateMarginPercentage = (purchasePrice: number, sellingPrice: number) => {
    if (purchasePrice === 0) return 0
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Chargement...</div>
        </div>
      </DashboardLayout>
    )
  }

  if (!product) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Produit non trouvé</div>
        </div>
      </DashboardLayout>
    )
  }

  const margin = calculateMargin(product.purchasePrice, product.sellingPrice)
  const marginPercentage = calculateMarginPercentage(product.purchasePrice, product.sellingPrice)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header avec navigation */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/products')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour aux produits
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">{product.brand}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Modifier
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 items-stretch">
          {/* Informations principales */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image et statut */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Image du produit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={product.imageUrl || undefined} alt={product.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-2xl">
                      {product.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Statut</label>
                      <div className="mt-1">
                        <ProductStatusBadge
                          value={product.status}
                          onChange={handleStatusChange}
                        />
                      </div>
                    </div>
                    {product.soldAt && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date de vente</label>
                        <p className="text-sm">
                          {new Date(product.soldAt).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations détaillées */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Informations détaillées
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                    <p className="text-sm">{categoryLabels[product.category]}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Marque</label>
                    <p className="text-sm">{product.brand}</p>
                  </div>
                </div>
                
                {product.size && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      Taille
                    </label>
                    <p className="text-sm">{product.size}</p>
                  </div>
                )}

                {product.sku && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Tag className="h-4 w-4" />
                      SKU
                    </label>
                    <p className="text-sm font-mono">{product.sku}</p>
                  </div>
                )}

                {product.description && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm mt-1">{product.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informations financières */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Informations financières
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix d'achat</label>
                  <p className="text-lg font-semibold">{formatCurrency(product.purchasePrice)}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Prix de vente</label>
                  <p className="text-lg font-semibold">{formatCurrency(product.sellingPrice)}</p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    Marge
                  </label>
                  <div className="space-y-1">
                    <p className="text-lg font-semibold text-green-600">
                      {formatCurrency(margin)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {marginPercentage.toFixed(1)}% de marge
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dates */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Dates importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Date d'ajout</label>
                  <p className="text-sm">
                    {new Date(product.createdAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dernière modification</label>
                  <p className="text-sm">
                    {new Date(product.updatedAt).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
