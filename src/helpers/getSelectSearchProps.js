export const getSelectSearchProps = () => {
  return {
    showSearch: true,
    filterOption: (input, option) =>
      (option?.label ?? '').toLowerCase().includes(input.toLowerCase()),
  }
}
