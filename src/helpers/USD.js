import currency from 'currency.js'

export const USD = (value, opts) =>
  currency(value, {
    decimal: '.',
    separator: ',',
    precision: 2,
    ...opts,
  }).format()
