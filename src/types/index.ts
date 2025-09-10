import { User, Product, Transaction, Category, ProductStatus, TransactionType, Role } from '@prisma/client'

// Types étendus pour l'API
export interface ProductWithTransactions extends Product {
  transactions: Transaction[]
}

export interface TransactionWithProduct extends Transaction {
  product?: Product | null
}

export interface UserWithStats extends User {
  _count: {
    products: number
    transactions: number
  }
}

// Types pour les formulaires
export interface CreateProductData {
  name: string
  description?: string
  category: Category
  brand: string
  size?: string
  purchasePrice: number
  sellingPrice: number
  imageUrl?: string
  sku?: string
}

export interface UpdateProductData extends Partial<CreateProductData> {
  status?: ProductStatus
}

export interface CreateTransactionData {
  type: TransactionType
  amount: number
  quantity?: number
  notes?: string
  productId?: string
}

// Types pour les analytics
export interface DashboardStats {
  totalProducts: number
  totalSales: number
  totalRevenue: number
  totalProfit: number
  averageMargin: number
  topCategories: Array<{
    category: Category
    count: number
    revenue: number
  }>
  topBrands: Array<{
    brand: string
    count: number
    revenue: number
  }>
  monthlyRevenue: Array<{
    month: string
    revenue: number
    profit: number
  }>
}

// Types pour les filtres
export interface ProductFilters {
  search?: string
  category?: Category
  brand?: string
  status?: ProductStatus
  minPrice?: number
  maxPrice?: number
}

export interface TransactionFilters {
  type?: TransactionType
  productId?: string
  startDate?: Date
  endDate?: Date
}

// Types pour la pagination
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Réexport des types Prisma
export type { User, Product, Transaction, Category, ProductStatus, TransactionType, Role }
