'use client'

import { useState } from 'react'
import { ProductStatusBadge } from '@/components/ui/product-status-badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ProductStatus = 'IN_STOCK' | 'RESERVED' | 'SOLD'

export function ProductStatusBadgeDemo() {
  const [status, setStatus] = useState<ProductStatus>('IN_STOCK')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (newValue: ProductStatus) => {
    setIsUpdating(true)
    
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setStatus(newValue)
    setIsUpdating(false)
  }

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Démonstration ProductStatusBadge</CardTitle>
          <CardDescription>
            Testez le nouveau composant de statut avec dropdown inline moderne
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Statut actuel :</h3>
            <ProductStatusBadge
              value={status}
              onChange={handleStatusChange}
              disabled={isUpdating}
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Tous les statuts :</h3>
            <div className="flex gap-2">
              <ProductStatusBadge
                value="IN_STOCK"
                onChange={() => {}}
              />
              <ProductStatusBadge
                value="RESERVED"
                onChange={() => {}}
              />
              <ProductStatusBadge
                value="SOLD"
                onChange={() => {}}
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">État désactivé :</h3>
            <ProductStatusBadge
              value="IN_STOCK"
              onChange={() => {}}
              disabled={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
