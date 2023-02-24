export const getSelectSearchProps = () => {
  return {
    showSearch: true,
    filterOption: (input, option) => {
      console.log({ input, option })
      return (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
    },
  }
}
