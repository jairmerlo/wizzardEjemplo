export const sorterAlphabetically = (array = [], dataIndex) => {
  return array.sort((a, b) => {
    return a[dataIndex].localeCompare(b[dataIndex])
  })
}
