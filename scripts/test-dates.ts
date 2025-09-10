import { getPeriodDates } from '../src/lib/period-utils'

console.log('Test des dates de période:')

const period = '30d'
const { start, end } = getPeriodDates(period)

console.log(`Période ${period}:`)
console.log(`- Start: ${start.toISOString()}`)
console.log(`- End: ${end.toISOString()}`)

// Test avec une date de vente réelle
const saleDate = new Date('2025-09-09T18:38:47.000Z')
console.log(`\nDate de vente test: ${saleDate.toISOString()}`)
console.log(`- >= start: ${saleDate >= start}`)
console.log(`- <= end: ${saleDate <= end}`)
console.log(`- Dans la période: ${saleDate >= start && saleDate <= end}`)
