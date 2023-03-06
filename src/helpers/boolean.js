export const boolean = (value, opts = {}) => {
  const { to = 'boolean' } = opts
  if (to === 'boolean_string') {
    switch (value) {
      case true:
        return '1'
      case false:
      default:
        return '0'
    }
  } else {
    switch (value) {
      case '1':
        return true
      case '0':
      default:
        return false
    }
  }
}
