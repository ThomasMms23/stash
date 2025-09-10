import { getPeriodDates } from '../src/lib/period-utils'

console.log('Test des périodes:')

const periods = ['30d', '3m', '6m', '1y'] as const

periods.forEach(period => {
  const { start, end } = getPeriodDates(period)
  console.log(`\n${period}:`)
  console.log(`- Start: ${start.toISOString()}`)
  console.log(`- End: ${end.toISOString()}`)
  
  // Test avec une date de vente réelle
  const saleDate = new Date('2025-09-09T16:38:47.000Z')
  const inPeriod = saleDate >= start && saleDate <= end
  console.log(`- Date de vente test (2025-09-09): ${inPeriod ? '✅ DANS' : '❌ HORS'} période`)
})
