import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductForm } from '@/components/products/product-form'
import { Category } from '@prisma/client'

// Mock des modules externes
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

const mockProduct = {
  id: '1',
  name: 'Test Product',
  description: 'Test Description',
  category: Category.SNEAKERS,
  brand: 'Nike',
  size: '42',
  purchasePrice: 100,
  sellingPrice: 150,
  imageUrl: 'https://example.com/image.jpg',
  sku: 'TEST-001',
  status: 'IN_STOCK',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('ProductForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form with correct title for new product', () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    expect(screen.getByText('Ajouter un produit')).toBeInTheDocument()
    expect(screen.getByText('Ajoutez un nouveau produit à votre inventaire')).toBeInTheDocument()
  })

  it('renders the form with correct title for editing product', () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={jest.fn()}
        onSuccess={jest.fn()}
        product={mockProduct}
      />
    )

    expect(screen.getByText('Modifier le produit')).toBeInTheDocument()
    expect(screen.getByText('Modifiez les informations du produit')).toBeInTheDocument()
  })

  it('pre-fills form fields when editing a product', () => {
    render(
      <ProductForm
        open={true}
        onOpenChange={jest.fn()}
        onSuccess={jest.fn()}
        product={mockProduct}
      />
    )

    expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Nike')).toBeInTheDocument()
    expect(screen.getByDisplayValue('42')).toBeInTheDocument()
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
    expect(screen.getByDisplayValue('150')).toBeInTheDocument()
    expect(screen.getByDisplayValue('TEST-001')).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(
      <ProductForm
        open={true}
        onOpenChange={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    const submitButton = screen.getByRole('button', { name: /créer/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Le nom est requis')).toBeInTheDocument()
      expect(screen.getByText('La marque est requise')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const user = userEvent.setup()
    const mockOnSuccess = jest.fn()
    const mockOnOpenChange = jest.fn()

    // Mock successful API response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockProduct),
    })

    render(
      <ProductForm
        open={true}
        onOpenChange={mockOnOpenChange}
        onSuccess={mockOnSuccess}
      />
    )

    // Fill form fields
    await user.type(screen.getByLabelText(/nom du produit/i), 'New Product')
    await user.type(screen.getByLabelText(/marque/i), 'Adidas')
    await user.selectOptions(screen.getByRole('combobox'), Category.SNEAKERS)
    await user.type(screen.getByLabelText(/prix d'achat/i), '120')
    await user.type(screen.getByLabelText(/prix de vente/i), '180')

    const submitButton = screen.getByRole('button', { name: /créer/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: expect.stringContaining('"name":"New Product"'),
      })
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()

    // Mock API error
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ message: 'API Error' }),
    })

    render(
      <ProductForm
        open={true}
        onOpenChange={jest.fn()}
        onSuccess={jest.fn()}
      />
    )

    // Fill form fields
    await user.type(screen.getByLabelText(/nom du produit/i), 'New Product')
    await user.type(screen.getByLabelText(/marque/i), 'Adidas')
    await user.selectOptions(screen.getByRole('combobox'), Category.SNEAKERS)
    await user.type(screen.getByLabelText(/prix d'achat/i), '120')
    await user.type(screen.getByLabelText(/prix de vente/i), '180')

    const submitButton = screen.getByRole('button', { name: /créer/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('API Error')).toBeInTheDocument()
    })
  })
})
