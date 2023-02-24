import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Space } from 'antd'
import React from 'react'
import { renderTextHighlighter } from './renderTextHighlighter'

export const getColumnSearchProps = ({
  dataIndex,
  searchText,
  searchInput,
  searchedColumn,
  normalizeText,
  onSearch = f => f,
  onReset = f => f,
}) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
    close,
  }) => (
    <div
      style={{
        padding: 8,
      }}
      onKeyDown={e => e.stopPropagation()}
    >
      <Input
        ref={searchInput}
        placeholder={`Search ${dataIndex}`}
        value={selectedKeys[0]}
        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
        onPressEnter={() => onSearch(selectedKeys, confirm, dataIndex)}
        style={{
          marginBottom: 8,
          display: 'block',
        }}
      />
      <Space>
        <Button
          type='primary'
          onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size='small'
          style={{
            width: 90,
          }}
        >
          Search
        </Button>
        <Button
          onClick={() =>
            clearFilters && onReset(clearFilters, confirm, dataIndex)
          }
          size='small'
          style={{
            width: 90,
          }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined
      style={{
        color: filtered ? '#1890ff' : undefined,
      }}
    />
  ),
  onFilter: (value, record) =>
    record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
  onFilterDropdownOpenChange: visible => {
    if (visible) {
      setTimeout(() => searchInput.current?.select(), 100)
    }
  },
  render: text =>
    renderTextHighlighter({
      text: normalizeText ? normalizeText(text) : text,
      isHighlighted: searchedColumn[dataIndex],
      highlightedText: searchText[dataIndex],
    }),
})
