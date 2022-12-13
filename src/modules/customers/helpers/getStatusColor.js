export const getStatusColor = status => {
  switch (status) {
    case 'active':
      return 'green'

    case 'unactive':
      return 'volcano'
    case 'pending':
      return 'gold'
    default:
      return 'geekblue'
  }
}
