import { useReducer, useRef } from 'react'
import { reducer } from '../helpers'

export const useColumnSearch = initialState => {
  const [searchText, setSearchText] = useReducer(reducer, initialState)
  const [searchedColumn, setSearchedColumn] = useReducer(reducer, initialState)
  const searchInput = useRef(null)
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm()
    setSearchText({ [dataIndex]: selectedKeys[0] })
    setSearchedColumn({ [dataIndex]: true })
  }
  const handleReset = (clearFilters, confirm, dataIndex) => {
    clearFilters()
    confirm({ closeDropdown: true })
    setSearchedColumn({ [dataIndex]: false })
    setSearchText({ [dataIndex]: '' })
  }
  return {
    searchText,
    searchedColumn,
    searchInput,
    handleReset,
    handleSearch,
  }
}
