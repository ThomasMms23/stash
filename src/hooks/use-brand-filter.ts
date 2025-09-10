'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useBrandFilter() {
  const router = useRouter()

  const handleBrandClick = useCallback((brand: string) => {
    // Stocker la marque sélectionnée dans le localStorage
    localStorage.setItem('selectedBrand', brand)
    // Rediriger vers la page des produits
    router.push('/dashboard/products')
  }, [router])

  return {
    handleBrandClick,
  }
}
