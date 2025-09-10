'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  Search, 
  ArrowUpDown, 
  TrendingUp, 
  Package,
  DollarSign,
  Clock
} from 'lucide-react'
import { formatCurrency } from '@/lib/period-utils'

interface ProductData {
  id: string
  name: string
  brand: string
  category: string
  revenue: number
  margin: number
  salesCount: number
  daysInStock: number
}

interface TopProductsTableProps {
  data: ProductData[]
}

const categoryLabels = {
  SNEAKERS: 'Sneakers',
  CLOTHING: 'Vêtements',
  ACCESSORIES: 'Accessoires',
  ELECTRONICS: 'Électronique',
  COLLECTIBLES: 'Collection',
  OTHER: 'Autre',
}

type SortField = 'revenue' | 'margin' | 'salesCount' | 'daysInStock'
type SortDirection = 'asc' | 'desc'

export function TopProductsTable({ data }: TopProductsTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<SortField>('revenue')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredAndSortedData = data
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.brand.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(field)}
      className="h-auto p-0 font-medium"
    >
      <div className="flex items-center space-x-1">
        <span>{children}</span>
        {sortField === field && (
          <ArrowUpDown className="h-3 w-3" />
        )}
      </div>
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher un produit ou une marque..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filtrer par catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {Object.entries(categoryLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tableau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Produits les plus performants
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produit</TableHead>
                <TableHead>Catégorie</TableHead>
                <TableHead>
                  <SortButton field="revenue">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Revenus
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="margin">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Marge
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="salesCount">
                    <Package className="h-4 w-4 mr-1" />
                    Ventes
                  </SortButton>
                </TableHead>
                <TableHead>
                  <SortButton field="daysInStock">
                    <Clock className="h-4 w-4 mr-1" />
                    Jours en stock
                  </SortButton>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedData.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-sm text-muted-foreground">{product.brand}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {categoryLabels[product.category as keyof typeof categoryLabels] || product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(product.revenue)}
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {formatCurrency(product.margin)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {product.salesCount} vente{product.salesCount > 1 ? 's' : ''}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{product.daysInStock}</span>
                      <span className="text-xs text-muted-foreground">jours</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredAndSortedData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun produit trouvé</p>
              <p className="text-sm">Essayez de modifier vos filtres de recherche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
