'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Product, ProductStatus, Category } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ProductForm } from './product-form'
import { ProductStatusBadge } from '@/components/ui/product-status-badge'
import { Edit, MoreHorizontal, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

interface ProductsTableProps {
  products: Product[]
  onRefresh: () => void
}

const categoryLabels = {
  [Category.SNEAKERS]: 'Sneakers',
  [Category.CLOTHING]: 'Vêtements',
  [Category.ACCESSORIES]: 'Accessoires',
  [Category.ELECTRONICS]: 'Électronique',
  [Category.COLLECTIBLES]: 'Collection',
  [Category.OTHER]: 'Autre',
}

export function ProductsTable({ products, onRefresh }: ProductsTableProps) {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [openDropdownProductId, setOpenDropdownProductId] = useState<string | null>(null)
  const router = useRouter()

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleViewDetails = (productId: string) => {
    router.push(`/dashboard/products/${productId}`)
  }

  const handleDelete = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Produit supprimé avec succès')
        onRefresh()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la suppression')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    }
  }

  const handleFormSuccess = () => {
    setEditingProduct(null)
    onRefresh()
  }

  const handleStatusChange = async (productId: string, newStatus: ProductStatus) => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success('Statut mis à jour avec succès')
        onRefresh()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Erreur lors de la mise à jour du statut')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
      throw error // Re-throw pour que le composant puisse gérer l'erreur
    }
  }

  const calculateMargin = (purchasePrice: number, sellingPrice: number) => {
    return sellingPrice - purchasePrice
  }

  const calculateMarginPercentage = (purchasePrice: number, sellingPrice: number) => {
    return ((sellingPrice - purchasePrice) / purchasePrice) * 100
  }

  const handleDropdownOpenChange = (productId: string, isOpen: boolean) => {
    if (isOpen) {
      setOpenDropdownProductId(productId)
    } else {
      setOpenDropdownProductId(null)
    }
  }

  const isLastOrSecondLastProduct = (productId: string) => {
    const lastIndex = products.length - 1
    const secondLastIndex = products.length - 2
    return products[lastIndex]?.id === productId || products[secondLastIndex]?.id === productId
  }

  const shouldShowSpacer = () => {
    return openDropdownProductId && isLastOrSecondLastProduct(openDropdownProductId)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produit</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Marque</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Prix d'achat</TableHead>
              <TableHead>Prix de vente</TableHead>
              <TableHead>Marge</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow 
                key={product.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleViewDetails(product.id)}
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={product.imageUrl || ''} alt={product.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-sm">
                        {product.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      {product.sku && (
                        <div className="text-sm text-muted-foreground">
                          SKU: {product.sku}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {categoryLabels[product.category]}
                  </Badge>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>{product.size || '-'}</TableCell>
                <TableCell>{product.purchasePrice.toFixed(2)}€</TableCell>
                <TableCell>{product.sellingPrice.toFixed(2)}€</TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div className="font-medium">
                      {calculateMargin(product.purchasePrice, product.sellingPrice).toFixed(2)}€
                    </div>
                    <div className="text-muted-foreground">
                      {calculateMarginPercentage(product.purchasePrice, product.sellingPrice).toFixed(1)}%
                    </div>
                  </div>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <ProductStatusBadge
                    value={product.status}
                    onChange={async (newValue) => {
                      try {
                        await handleStatusChange(product.id, newValue)
                      } catch (error) {
                        // L'erreur est déjà gérée dans handleStatusChange
                      }
                    }}
                    onOpenChange={(isOpen) => handleDropdownOpenChange(product.id, isOpen)}
                  />
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(product.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Voir détails
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {/* Espace dynamique pour les deux derniers produits avec dropdown ouvert */}
            {shouldShowSpacer() && (
              <TableRow className="h-24">
                <TableCell colSpan={9} className="p-0 border-0"></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={handleFormSuccess}
        product={editingProduct}
      />
    </>
  )
}
