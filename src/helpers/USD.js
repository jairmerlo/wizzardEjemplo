import currency from 'currency.js'

export const USD = value =>
  currency(value, {
    decimal: '.',
    separator: ',',
    precision: 0,
  }).format()
