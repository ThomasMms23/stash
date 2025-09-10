import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductsTable } from '@/components/products/products-table'
import { Product, Category, ProductStatus } from '@prisma/client'

// Mock des modules externes
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}))

// Mock fetch
global.fetch = jest.fn()

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Air Jordan 1',
    description: 'Classic sneakers',
    category: Category.SNEAKERS,
    brand: 'Nike',
    size: '42',
    purchasePrice: 100,
    sellingPrice: 150,
    imageUrl: 'https://example.com/image1.jpg',
    sku: 'AJ1-001',
    status: ProductStatus.IN_STOCK,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Yeezy Boost 350',
    description: 'Comfortable sneakers',
    category: Category.SNEAKERS,
    brand: 'Adidas',
    size: '43',
    purchasePrice: 200,
    sellingPrice: 300,
    imageUrl: 'https://example.com/image2.jpg',
    sku: 'YZ-002',
    status: ProductStatus.SOLD,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

describe('ProductsTable', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders products table with correct data', () => {
    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={jest.fn()}
      />
    )

    expect(screen.getByText('Air Jordan 1')).toBeInTheDocument()
    expect(screen.getByText('Yeezy Boost 350')).toBeInTheDocument()
    expect(screen.getByText('Nike')).toBeInTheDocument()
    expect(screen.getByText('Adidas')).toBeInTheDocument()
    expect(screen.getByText('42')).toBeInTheDocument()
    expect(screen.getByText('43')).toBeInTheDocument()
  })

  it('displays correct status badges', () => {
    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={jest.fn()}
      />
    )

    expect(screen.getByText('En stock')).toBeInTheDocument()
    expect(screen.getByText('Vendu')).toBeInTheDocument()
  })

  it('calculates and displays margins correctly', () => {
    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={jest.fn()}
      />
    )

    // Air Jordan 1: 150 - 100 = 50€ margin
    expect(screen.getByText('50.00€')).toBeInTheDocument()
    // Yeezy Boost 350: 300 - 200 = 100€ margin
    expect(screen.getByText('100.00€')).toBeInTheDocument()
  })

  it('opens edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={jest.fn()}
      />
    )

    const editButtons = screen.getAllByRole('button', { name: /more horizontal/i })
    await user.click(editButtons[0])

    expect(screen.getByText('Modifier')).toBeInTheDocument()
  })

  it('handles delete confirmation', async () => {
    const user = userEvent.setup()
    const mockOnRefresh = jest.fn()

    // Mock successful delete response
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ message: 'Produit supprimé avec succès' }),
    })

    // Mock window.confirm
    window.confirm = jest.fn(() => true)

    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={mockOnRefresh}
      />
    )

    const moreButtons = screen.getAllByRole('button', { name: /more horizontal/i })
    await user.click(moreButtons[0])

    const deleteButton = screen.getByText('Supprimer')
    await user.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce produit ?')
    expect(global.fetch).toHaveBeenCalledWith('/api/products/1', {
      method: 'DELETE',
    })
  })

  it('does not delete when confirmation is cancelled', async () => {
    const user = userEvent.setup()
    const mockOnRefresh = jest.fn()

    // Mock window.confirm to return false
    window.confirm = jest.fn(() => false)

    render(
      <ProductsTable
        products={mockProducts}
        onRefresh={mockOnRefresh}
      />
    )

    const moreButtons = screen.getAllByRole('button', { name: /more horizontal/i })
    await user.click(moreButtons[0])

    const deleteButton = screen.getByText('Supprimer')
    await user.click(deleteButton)

    expect(window.confirm).toHaveBeenCalledWith('Êtes-vous sûr de vouloir supprimer ce produit ?')
    expect(global.fetch).not.toHaveBeenCalled()
  })
})
