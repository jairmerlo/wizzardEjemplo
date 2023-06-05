import { Modal, Skeleton, Table } from 'antd'
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
import { useGetCustomerV2BillingQuery } from '../../../app/api/billing'
import { useEffect, useState } from 'react'
import { FilePdfOutlined } from '@ant-design/icons'

export const BillingHistoryTable = ({ dataSource, customerId }) => {

  // console.log({ customerId })
  const { data = [], isLoading } = useGetCustomerV2BillingQuery(customerId)

  console.log({ data })

  const [pdfs, setPdfS] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const handleViewPdf = async id => {
    setPdfS([])
    setIsModalOpen(true)
    console.log({ id })
    const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
      method: 'get',
    }).then(res => res.json())
    setPdfS(res)
    // const { url = 'about:blank' } = await fetch(
    //   API._BILLING_HOST + '/get-invoice-pdf/' + id,
    // ).then(res => res.json())

    // window.open(url, '_blank')
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
        <button style={{ color: 'blue', border: 'none', backgroundColor: 'white' }} className='underlineHover' onClick={() => handleViewPdf(record.id)}>{text}</button>
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
        title: 'AMOUNT',
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
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={data}
        bordered
        pagination={{
          showTotal,
        }}
        loading={isLoading}
      />
      <Modal
        title='Payment Billing Information'
        width='50%'
        style={{ height: '20px' }}
        open={isModalOpen}
        footer={[]}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {pdfs.url && (
          <object
            data={pdfs.url}
            type='application/pdf'
            style={{ width: '100%', height: '700px' }}
          >
            <iframe frameborder='0' width={'100%'} title='pdf'></iframe>
          </object>
        )}

        {!pdfs.url && (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Skeleton.Node active={true} size={'large'} block={true}>
              <FilePdfOutlined
                style={{
                  fontSize: 60,
                  color: '#bfbfbf',
                }}
              />
            </Skeleton.Node>
          </div>
        )}
      </Modal>
    </>
  )
}
