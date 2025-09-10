import { 
  createProductSchema, 
  updateProductSchema, 
  createTransactionSchema,
  signUpSchema,
  signInSchema 
} from '@/lib/validations'
import { Category, TransactionType } from '@prisma/client'

describe('Validation Schemas', () => {
  describe('createProductSchema', () => {
    it('validates correct product data', () => {
      const validProduct = {
        name: 'Test Product',
        description: 'Test description',
        category: Category.SNEAKERS,
        brand: 'Nike',
        size: '42',
        purchasePrice: 100,
        sellingPrice: 150,
        imageUrl: 'https://example.com/image.jpg',
        sku: 'TEST-001',
      }

      const result = createProductSchema.safeParse(validProduct)
      expect(result.success).toBe(true)
    })

    it('rejects product with missing required fields', () => {
      const invalidProduct = {
        name: 'Test Product',
        // Missing required fields
      }

      const result = createProductSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['category'],
            message: 'Catégorie invalide',
          })
        )
      }
    })

    it('rejects product with invalid price', () => {
      const invalidProduct = {
        name: 'Test Product',
        category: Category.SNEAKERS,
        brand: 'Nike',
        purchasePrice: -10, // Negative price
        sellingPrice: 150,
      }

      const result = createProductSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['purchasePrice'],
            message: "Le prix d'achat doit être positif",
          })
        )
      }
    })

    it('rejects product with invalid URL', () => {
      const invalidProduct = {
        name: 'Test Product',
        category: Category.SNEAKERS,
        brand: 'Nike',
        purchasePrice: 100,
        sellingPrice: 150,
        imageUrl: 'not-a-valid-url',
      }

      const result = createProductSchema.safeParse(invalidProduct)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['imageUrl'],
            message: "URL d'image invalide",
          })
        )
      }
    })
  })

  describe('updateProductSchema', () => {
    it('validates partial product data', () => {
      const partialProduct = {
        name: 'Updated Product',
        sellingPrice: 200,
      }

      const result = updateProductSchema.safeParse(partialProduct)
      expect(result.success).toBe(true)
    })

    it('validates empty update', () => {
      const emptyUpdate = {}

      const result = updateProductSchema.safeParse(emptyUpdate)
      expect(result.success).toBe(true)
    })
  })

  describe('createTransactionSchema', () => {
    it('validates correct transaction data', () => {
      const validTransaction = {
        type: TransactionType.SALE,
        amount: 150,
        quantity: 1,
        notes: 'Sold to customer',
        productId: 'product-123',
      }

      const result = createTransactionSchema.safeParse(validTransaction)
      expect(result.success).toBe(true)
    })

    it('sets default quantity to 1', () => {
      const transactionWithoutQuantity = {
        type: TransactionType.SALE,
        amount: 150,
      }

      const result = createTransactionSchema.safeParse(transactionWithoutQuantity)
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data.quantity).toBe(1)
      }
    })

    it('rejects transaction with negative amount', () => {
      const invalidTransaction = {
        type: TransactionType.SALE,
        amount: -50,
      }

      const result = createTransactionSchema.safeParse(invalidTransaction)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['amount'],
            message: 'Le montant doit être positif',
          })
        )
      }
    })
  })

  describe('signUpSchema', () => {
    it('validates correct signup data', () => {
      const validSignup = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      }

      const result = signUpSchema.safeParse(validSignup)
      expect(result.success).toBe(true)
    })

    it('rejects invalid email', () => {
      const invalidSignup = {
        name: 'John Doe',
        email: 'invalid-email',
        password: 'password123',
      }

      const result = signUpSchema.safeParse(invalidSignup)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'Email invalide',
          })
        )
      }
    })

    it('rejects short password', () => {
      const invalidSignup = {
        name: 'John Doe',
        email: 'john@example.com',
        password: '123', // Too short
      }

      const result = signUpSchema.safeParse(invalidSignup)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['password'],
            message: 'Le mot de passe doit contenir au moins 6 caractères',
          })
        )
      }
    })
  })

  describe('signInSchema', () => {
    it('validates correct signin data', () => {
      const validSignin = {
        email: 'john@example.com',
        password: 'password123',
      }

      const result = signInSchema.safeParse(validSignin)
      expect(result.success).toBe(true)
    })

    it('rejects missing email', () => {
      const invalidSignin = {
        password: 'password123',
      }

      const result = signInSchema.safeParse(invalidSignin)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.errors).toContainEqual(
          expect.objectContaining({
            path: ['email'],
            message: 'Email invalide',
          })
        )
      }
    })
  })
})
