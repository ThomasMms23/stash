import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import Papa from 'papaparse'

// Types pour les données d'export
export interface ExportData {
  categories: Array<{
    category: string
    count: number
    revenue: number
    percentage: number
  }>
  brands: Array<{
    brand: string
    count: number
    revenue: number
    percentage: number
  }>
  periodRevenue: Array<{
    period: string
    revenue: number
    profit: number
  }>
  kpis: {
    totalRevenue: number
    totalProfit: number
    totalSales: number
    averageMargin: number
  }
  period: string
  generatedAt: Date
}

// Fonction pour exporter en CSV
export const exportToCSV = (data: ExportData) => {
  const csvData = [
    // En-tête
    ['Rapport Analytics - Stash.', ''],
    ['Période', data.period],
    ['Généré le', data.generatedAt.toLocaleDateString('fr-FR')],
    ['', ''],
    
    // KPIs
    ['INDICATEURS CLÉS', ''],
    ['Revenus totaux', `${data.kpis.totalRevenue.toFixed(2)} €`],
    ['Bénéfices totaux', `${data.kpis.totalProfit.toFixed(2)} €`],
    ['Ventes réalisées', data.kpis.totalSales.toString()],
    ['Marge moyenne', `${data.kpis.averageMargin.toFixed(1)} %`],
    ['', ''],
    
    // Top Catégories
    ['TOP CATÉGORIES', '', '', ''],
    ['Catégorie', 'Produits vendus', 'Revenus (€)', 'Part (%)'],
    ...data.categories.map(cat => [
      cat.category,
      cat.count.toString(),
      cat.revenue.toFixed(2),
      cat.percentage.toFixed(1)
    ]),
    ['', '', '', ''],
    
    // Top Marques
    ['TOP MARQUES', '', '', ''],
    ['Marque', 'Produits vendus', 'Revenus (€)', 'Part (%)'],
    ...data.brands.map(brand => [
      brand.brand,
      brand.count.toString(),
      brand.revenue.toFixed(2),
      brand.percentage.toFixed(1)
    ]),
    ['', '', '', ''],
    
    // Évolution des revenus
    ['ÉVOLUTION DES REVENUS', '', '', ''],
    ['Période', 'Revenus (€)', 'Bénéfices (€)', ''],
    ...data.periodRevenue.map(period => [
      period.period,
      period.revenue.toFixed(2),
      period.profit.toFixed(2),
      ''
    ])
  ]

  const csv = Papa.unparse(csvData)
  
  // Créer et télécharger le fichier
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `analytics-stash-${data.period}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Fonction pour exporter en PDF
export const exportToPDF = (data: ExportData) => {
  const doc = new jsPDF()
  
  // Configuration de la police
  doc.setFont('helvetica')
  
  // Titre principal
  doc.setFontSize(20)
  doc.text('Rapport Analytics - Stash.', 14, 22)
  
  // Informations de période
  doc.setFontSize(12)
  doc.text(`Période: ${data.period}`, 14, 32)
  doc.text(`Généré le: ${data.generatedAt.toLocaleDateString('fr-FR')}`, 14, 38)
  
  let yPosition = 50
  
  // Section KPIs
  doc.setFontSize(16)
  doc.text('Indicateurs Clés', 14, yPosition)
  yPosition += 10
  
  doc.setFontSize(10)
  const kpiData = [
    ['Revenus totaux', `${data.kpis.totalRevenue.toFixed(2)} €`],
    ['Bénéfices totaux', `${data.kpis.totalProfit.toFixed(2)} €`],
    ['Ventes réalisées', data.kpis.totalSales.toString()],
    ['Marge moyenne', `${data.kpis.averageMargin.toFixed(1)} %`]
  ]
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Métrique', 'Valeur']],
    body: kpiData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 }
  })
  
  yPosition = (doc as any).lastAutoTable.finalY + 15
  
  // Section Top Catégories
  doc.setFontSize(16)
  doc.text('Top Catégories', 14, yPosition)
  yPosition += 10
  
  const categoryData = data.categories.map(cat => [
    cat.category,
    cat.count.toString(),
    `${cat.revenue.toFixed(2)} €`,
    `${cat.percentage.toFixed(1)} %`
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Catégorie', 'Produits vendus', 'Revenus', 'Part']],
    body: categoryData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 }
  })
  
  yPosition = (doc as any).lastAutoTable.finalY + 15
  
  // Section Top Marques
  doc.setFontSize(16)
  doc.text('Top Marques', 14, yPosition)
  yPosition += 10
  
  const brandData = data.brands.map(brand => [
    brand.brand,
    brand.count.toString(),
    `${brand.revenue.toFixed(2)} €`,
    `${brand.percentage.toFixed(1)} %`
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Marque', 'Produits vendus', 'Revenus', 'Part']],
    body: brandData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 }
  })
  
  yPosition = (doc as any).lastAutoTable.finalY + 15
  
  // Section Évolution des revenus
  doc.setFontSize(16)
  doc.text('Évolution des Revenus', 14, yPosition)
  yPosition += 10
  
  const revenueData = data.periodRevenue.map(period => [
    period.period,
    `${period.revenue.toFixed(2)} €`,
    `${period.profit.toFixed(2)} €`
  ])
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Période', 'Revenus', 'Bénéfices']],
    body: revenueData,
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] },
    styles: { fontSize: 10 }
  })
  
  // Pied de page
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(
      `Page ${i} sur ${pageCount} - Généré par Stash.`,
      doc.internal.pageSize.width - 60,
      doc.internal.pageSize.height - 10
    )
  }
  
  // Télécharger le PDF
  doc.save(`analytics-stash-${data.period}-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Mapping des catégories pour la traduction
export const categoryLabels = {
  SNEAKERS: 'Sneakers',
  CLOTHING: 'Vêtements',
  ACCESSORIES: 'Accessoires',
  ELECTRONICS: 'Électronique',
  COLLECTIBLES: 'Collection',
  OTHER: 'Autre',
}
