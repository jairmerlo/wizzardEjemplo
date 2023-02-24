export const getColumnFilterProps = ({ dataIndex, filters }) => {
  return {
    filters,
    filterSearch: true,
    onFilter: (value, record) =>
      record[dataIndex] && record[dataIndex].startsWith(value),
  }
}
