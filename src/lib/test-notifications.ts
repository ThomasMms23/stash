// Script de test pour créer des notifications de démonstration
// À exécuter dans la console du navigateur ou via une API

const testNotifications = async () => {
  try {
    // Créer une notification de nouveau produit
    const newProductResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Nouveau produit ajouté',
        message: 'Le produit "Air Jordan 1 Retro" a été ajouté à votre inventaire',
        type: 'NEW_PRODUCT',
        productId: 'test-product-1',
      }),
    })

    // Créer une notification de vente
    const saleResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Vente finalisée',
        message: 'Vente de "Nike Air Max 90" pour 120.00€',
        type: 'SALE_COMPLETED',
      }),
    })

    // Créer une notification de stock faible
    const stockResponse = await fetch('/api/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Stock faible',
        message: 'Le produit "Adidas Ultraboost" est en stock critique',
        type: 'LOW_STOCK',
        productId: 'test-product-2',
      }),
    })

    console.log('Notifications de test créées:', {
      newProduct: newProductResponse.ok,
      sale: saleResponse.ok,
      stock: stockResponse.ok,
    })
  } catch (error) {
    console.error('Erreur lors de la création des notifications de test:', error)
  }
}

// Exporter pour utilisation dans la console
if (typeof window !== 'undefined') {
  (window as any).testNotifications = testNotifications
}

export { testNotifications }
