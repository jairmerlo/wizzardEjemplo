export const getStatusColor = status => {
  switch (status) {
    case 'Active':
      return 'green'
    case 'Unactive':
      return 'volcano'
    case 'Pending':
      return 'gold'
    default:
      return 'geekblue'
  }
}
