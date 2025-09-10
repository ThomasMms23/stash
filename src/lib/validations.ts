import { z } from 'zod'
import { Category, ProductStatus, TransactionType } from '@prisma/client'

// Schémas pour les produits
export const createProductSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  description: z.string().max(500, 'La description ne peut pas dépasser 500 caractères').optional(),
  category: z.nativeEnum(Category, {
    errorMap: () => ({ message: 'Catégorie invalide' })
  }),
  brand: z.string().min(1, 'La marque est requise').max(50, 'La marque ne peut pas dépasser 50 caractères'),
  size: z.string().max(20, 'La taille ne peut pas dépasser 20 caractères').optional(),
  purchasePrice: z.number().positive('Le prix d\'achat doit être positif'),
  sellingPrice: z.number().positive('Le prix de vente doit être positif'),
  imageUrl: z.string().refine((val) => !val || z.string().url().safeParse(val).success, {
    message: 'URL d\'image invalide'
  }).optional(),
  sku: z.string().max(50, 'Le SKU ne peut pas dépasser 50 caractères').optional(),
})

export const updateProductSchema = createProductSchema.partial().extend({
  status: z.nativeEnum(ProductStatus).optional(),
  soldAt: z.string().datetime().optional(),
})

export const productFiltersSchema = z.object({
  search: z.string().optional(),
  category: z.union([z.nativeEnum(Category), z.literal('all')]).optional(),
  brand: z.string().optional(),
  status: z.union([z.nativeEnum(ProductStatus), z.literal('all')]).optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
})

// Schémas pour les transactions
export const createTransactionSchema = z.object({
  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Type de transaction invalide' })
  }),
  amount: z.number().positive('Le montant doit être positif'),
  quantity: z.number().int().positive('La quantité doit être un entier positif').default(1),
  notes: z.string().max(500, 'Les notes ne peuvent pas dépasser 500 caractères').optional(),
  productId: z.string().cuid('ID de produit invalide').optional(),
})

export const transactionFiltersSchema = z.object({
  type: z.nativeEnum(TransactionType).optional(),
  productId: z.string().cuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// Schémas pour la pagination
export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
})

// Schémas pour l'authentification
export const signInSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

export const signUpSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(50, 'Le nom ne peut pas dépasser 50 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/(?=.*[a-z])/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/(?=.*[A-Z])/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/(?=.*\d)/, 'Le mot de passe doit contenir au moins un chiffre')
    .regex(/(?=.*[@$!%*?&])/, 'Le mot de passe doit contenir au moins un caractère spécial (@$!%*?&)'),
})

// Types inférés des schémas
export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type ProductFiltersInput = z.infer<typeof productFiltersSchema>
export type CreateTransactionInput = z.infer<typeof createTransactionSchema>
export type TransactionFiltersInput = z.infer<typeof transactionFiltersSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
