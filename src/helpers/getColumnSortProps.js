import moment from 'moment'

export const getColumnSortProps = ({
  dataIndex,
  sorter,
  type,
  format = 'MM-DD-YYYY',
  ellipsis = true,
}) => {
  const getSorter = () => {
    switch (type) {
      case 'text':
        return (a, b) => {
          return a[dataIndex].localeCompare(b[dataIndex])
        }
      case 'number':
        return (a, b) => {
          return parseFloat(a[dataIndex]) - parseFloat(b[dataIndex])
        }
      case 'date':
        return (a, b) => {
          return moment(moment(a[dataIndex], format)).diff(
            moment(b[dataIndex], format),
          )
        }
      default:
        return (a, b) => {
          return a[dataIndex].localeCompare(b[dataIndex])
        }
    }
  }

  return {
    sorter: sorter || getSorter(),
    ellipsis,
  }
}
