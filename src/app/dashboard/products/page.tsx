'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { ProductsTable } from '@/components/products/products-table'
import { ProductForm } from '@/components/products/product-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, Filter, X } from 'lucide-react'
import { Product, Category, ProductStatus } from '@prisma/client'
import { toast } from 'sonner'

const categories = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: Category.SNEAKERS, label: 'Sneakers' },
  { value: Category.CLOTHING, label: 'Vêtements' },
  { value: Category.ACCESSORIES, label: 'Accessoires' },
  { value: Category.ELECTRONICS, label: 'Électronique' },
  { value: Category.COLLECTIBLES, label: 'Collection' },
  { value: Category.OTHER, label: 'Autre' },
]

const statuses = [
  { value: 'all', label: 'Tous les statuts' },
  { value: ProductStatus.IN_STOCK, label: 'En stock' },
  { value: ProductStatus.SOLD, label: 'Vendu' },
  { value: ProductStatus.RESERVED, label: 'Réservé' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    status: 'all',
    brand: '',
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })

  // Ref pour éviter le double déclenchement en mode développement
  const hasInitializedBrand = useRef(false)

  // Initialiser le filtre de marque depuis le localStorage
  useEffect(() => {
    if (hasInitializedBrand.current) return
    
    const selectedBrand = localStorage.getItem('selectedBrand')
    if (selectedBrand) {
      hasInitializedBrand.current = true
      const newFilters = { ...filters, brand: selectedBrand }
      setFilters(newFilters)
      // Nettoyer le localStorage après utilisation
      localStorage.removeItem('selectedBrand')
      // Déclencher la recherche avec les nouveaux filtres
      fetchProducts(newFilters, pagination)
    }
  }, []) // Empty dependency array - only run once on mount

  useEffect(() => {
    fetchProducts()
  }, [pagination.page, filters])

  const fetchProducts = async (customFilters?: typeof filters, customPagination?: typeof pagination) => {
    setIsLoading(true)
    try {
      const currentFilters = customFilters || filters
      const currentPagination = customPagination || pagination
      
      const params = new URLSearchParams({
        page: currentPagination.page.toString(),
        limit: currentPagination.limit.toString(),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.category && currentFilters.category !== 'all' && { category: currentFilters.category }),
        ...(currentFilters.status && currentFilters.status !== 'all' && { status: currentFilters.status }),
        ...(currentFilters.brand && { brand: currentFilters.brand }),
      })

      const response = await fetch(`/api/products?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.data)
        setPagination(data.pagination)
      } else {
        toast.error('Erreur lors du chargement des produits')
      }
    } catch (error) {
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters, pagination.page])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, page: 1 }))
  }

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }))
  }

  const totalValue = products.reduce((sum, product) => sum + product.sellingPrice, 0)
  const totalCost = products.reduce((sum, product) => sum + product.purchasePrice, 0)
  const totalMargin = totalValue - totalCost

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Produits</h1>
            <p className="text-muted-foreground">
              Gérez votre inventaire de produits
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="cursor-pointer">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un produit
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Produits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pagination.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valeur Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalValue.toFixed(2)}€</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coût Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCost.toFixed(2)}€</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Marge Totale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {totalMargin.toFixed(2)}€
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                Filtres
              </div>
              {filters.brand && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Marque: {filters.brand}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleFilterChange('brand', '')}
                  />
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-5">
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Recherche</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nom, marque, SKU..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Marque</label>
                <Input
                  placeholder="Filtrer par marque..."
                  value={filters.brand}
                  onChange={(e) => handleFilterChange('brand', e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Catégorie</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => handleFilterChange('category', value)}
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
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Statut</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un statut" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-muted-foreground">Actions</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: 'all',
                      status: 'all',
                      brand: '',
                    })
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="flex items-center gap-2 w-full cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  Réinitialiser
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des produits */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des produits</CardTitle>
            <CardDescription>
              {pagination.total} produit(s) trouvé(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-muted-foreground">Chargement...</div>
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 space-y-2">
                <div className="text-muted-foreground">Aucun produit trouvé</div>
                <Button variant="outline" onClick={() => setIsFormOpen(true)} className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter votre premier produit
                </Button>
              </div>
            ) : (
              <ProductsTable products={products} onRefresh={fetchProducts} />
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Page {pagination.page} sur {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>

      <ProductForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSuccess={fetchProducts}
      />
    </DashboardLayout>
  )
}
