import { Table } from 'antd'
import currency from 'currency.js'
import { API } from '../../../api'
import {
  date,
  getColumnProps,
  getColumnSearchProps,
  getColumnSortProps,
  showTotal,
} from '../../../helpers'
import { useColumnSearch } from '../../../hooks'

export const BillingHistoryTable = ({ dataSource }) => {
  const handleOpenPDF = async id => {
    const { url = 'about:blank' } = await fetch(
      API._BILLING_HOST + '/get-invoice-pdf/' + id,
    ).then(res => res.json())

    window.open(url, '_blank')
  }
  const { handleReset, handleSearch, searchInput, searchedColumn, searchText } =
    useColumnSearch({
      membership_id: null,
      wordpress_install_url: null,
      name: null,
      created_at: null,
      total: null,
    })

  const columns = [
    {
      ...getColumnProps({
        title: 'Membership ID',
        dataIndex: 'membership_id',
      }),
      ...getColumnSearchProps({
        dataIndex: 'membership_id',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'membership_id',
      }),
    },
    {
      ...getColumnProps({
        title: 'URL',
        dataIndex: 'wordpress_install_url',
      }),
      ...getColumnSearchProps({
        dataIndex: 'wordpress_install_url',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'wordpress_install_url',
      }),
      render: url => (
        <a href={url} target='_blank' rel='noreferrer'>
          {url}
        </a>
      ),
      ellipsis: true,
    },
    {
      ...getColumnProps({
        title: 'Invoice #',
        dataIndex: 'name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      render: (text, record) => (
        <a href onClick={() => handleOpenPDF(record.id)}>{text}</a>
      ),
      ...getColumnSortProps({
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({ title: 'Date', dataIndex: 'created_at' }),
      ...getColumnSearchProps({
        dataIndex: 'created_at',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'created_at',
      }),
      render: text => date(text),
    },
    {
      ...getColumnProps({
        title: '$ Lifetime',
        dataIndex: 'total',
      }),
      ...getColumnSearchProps({
        dataIndex: 'total',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'total',
        sorter: (a, b) =>
          parseFloat(currency(a.monthlyAmount).value) -
          parseFloat(currency(b.monthlyAmount).value),
      }),
    },
  ]
  return (
    <Table
      rowKey='id'
      size='small'
      columns={columns}
      dataSource={dataSource}
      bordered
      pagination={{
        showTotal,
      }}
    />
  )
}
