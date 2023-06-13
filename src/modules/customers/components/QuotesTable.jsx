import { EyeTwoTone, EditTwoTone, DeleteTwoTone, SendOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Modal, Space, Table, Tag, Tooltip, Typography, notification } from 'antd'
import currency from 'currency.js'
import {
  getColumnProps,
  getColumnSearchProps,
  getColumnSortProps,
  getDateColumnSearchProps,
  getSelectSearchProps,
  showTotal,
  USD,
} from '../../../helpers'
import { getColumnFilterProps } from '../../../helpers/getColumnFilterProps'
import { useColumnSearch } from '../../../hooks'
import { getStatusColor } from '../helpers'
import { useState } from 'react'
import { useDeleteQuoteMutation, useSendQuoteMutation } from '../../../app/api/billing'
import { useCss } from 'react-use'
import { EditQuote } from './EditQuote'

export const QuotesTable = ({ dataSource, refetch = f => f }) => {
  const { handleReset, handleSearch, searchInput, searchedColumn, searchText } =
    useColumnSearch({
      quote_name: null,
      name: null,
      accounting_class_name: null,
      created_on: null,
      total_amount: null,
    })

  // console.log({ dataSource })

  const button = useCss({
    fontWeight: '600',
    padding: '12px 30px',
    marginLeft: '10px',
    // padding: '7px 20px',
    fontSize: '14px',
    border: '1px solid #e4e4e4',
    borderRadius: '25px',
    minHeight: '50px'
  })

  const [sendQuote] = useSendQuoteMutation()
  const [deleteQuote] = useDeleteQuoteMutation()

  const [openSend, setOpenSend] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(false)
  const [currentUser, setCurrentUser] = useState({})

  const columns = [
    {
      ...getColumnProps({
        title: 'Quote ID',
        dataIndex: 'quote_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'quote_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'quote_name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Program',
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
      ...getColumnSortProps({
        dataIndex: 'name',
      }),
    },
    {
      ...getColumnProps({
        title: 'Product/Service',
        dataIndex: 'accounting_class_name',
      }),
      ...getColumnSearchProps({
        dataIndex: 'accounting_class_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'accounting_class_name',
      }),
    },
    {
      ...getColumnProps({ title: 'Created Date', dataIndex: 'created_on' }),
      ...getDateColumnSearchProps({
        dataIndex: 'created_on',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'created_on',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({ title: '$ Setup Fee', dataIndex: 'total_setup' }),
      ...getColumnSearchProps({
        dataIndex: 'total_setup',
        searchInput,
        searchedColumn,
        searchText,
        normalizeText: USD,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'total_setup',
        sorter: (a, b) => {
          return currency(a.total_setup).value - currency(b.total_setup).value
        },
      }),
    },
    {
      ...getColumnProps({ title: '$ Price', dataIndex: 'total_amount' }),
      ...getColumnSearchProps({
        dataIndex: 'total_amount',
        searchInput,
        searchedColumn,
        searchText,
        normalizeText: USD,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'total_amount',
        sorter: (a, b) => {
          return currency(a.total_amount).value - currency(b.total_amount).value
        },
      }),
    },
    {
      ...getColumnProps({
        title: 'Expired Date',
        dataIndex: 'expiration_date',
      }),
      ...getDateColumnSearchProps({
        dataIndex: 'expiration_date',
        initialFormat: 'MM-DD-YYYY',
        finalFormat: 'll',
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'expiration_date',
        type: 'date',
        format: 'MM-DD-YYYY',
      }),
    },
    {
      ...getColumnProps({
        title: 'Status',
        dataIndex: 'status',
      }),
      ...getColumnFilterProps({
        dataIndex: 'status',
        filters: [{ text: 'Completed', value: 'Completed' }],
      }),
      render: status => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      ...getColumnProps({ title: 'Sales Agent', dataIndex: 'user_name' }),
      ...getColumnSearchProps({
        dataIndex: 'user_name',
        searchInput,
        searchedColumn,
        searchText,
        onReset: handleReset,
        onSearch: handleSearch,
      }),
      ...getColumnSortProps({
        dataIndex: 'user_name',
      }),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record) => (
        <>
          {
            (record?.status === 'Waiting for Client' || record?.status === 'Pending to Send') && (
              <Space size='middle'>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EyeTwoTone style={{ fontSize: '18px' }} />
                  </a>
                </Tooltip>
                <Tooltip title='Edit' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EditTwoTone
                      style={{ fontSize: '18px' }}
                      onClick={() => {
                        setCurrentUser(record)
                        setOpen(true)
                      }}
                    />
                  </a>
                </Tooltip>
                <Tooltip title='Send' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <SendOutlined style={{ fontSize: '18px' }} onClick={() => {
                      setCurrentUser(record)
                      setOpenSend(true)
                    }
                    } />
                  </a>
                </Tooltip>
                <Tooltip title='Delete' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <DeleteTwoTone style={{ fontSize: '18px' }} onClick={() => {
                      setCurrentUser(record)
                      setOpenDelete(true)

                    }} />
                  </a>
                </Tooltip>
                {/* eslint-enable jsx-a11y/anchor-is-valid */}
              </Space>
            )
          }
          {
            (record?.status === 'Completed') && (
              <Space size='middle'>
                {/* eslint-disable jsx-a11y/anchor-is-valid */}
                <Tooltip title='Details' overlayStyle={{ zIndex: 10000 }}>
                  <a>
                    <EyeTwoTone style={{ fontSize: '18px' }} />
                  </a>
                </Tooltip>
                {/* eslint-enable jsx-a11y/anchor-is-valid */}
              </Space>
            )
          }
        </>
      ),
    },
  ]

  // console.log({ currentUser })

  return (
    <>
      <Table
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={dataSource?.map(item => ({
          ...item,
          price: parseFloat(item.total_amount) + parseFloat(item.total_setup),
        }))}
        bordered
        pagination={{
          showTotal,
        }}
      />
      {
        open && <EditQuote quote_name={currentUser?.quote_name} open={open} cancel={handleOpen} />
      }
      <Modal
        open={openSend}
        onOk={() => setOpenSend(false)}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        onCancel={() => setOpenSend(false)}
        width={600}
        centered
        destroyOnClose
      >
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>You sure want to send the quote?</Typography.Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 30,
          }}
        >
          <Button
            className={button}
            onClick={() => setOpenSend(false)}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={() => {
              setOpenSend(false)
              sendQuote({ quote_id: currentUser.quote_id, user_id: currentUser.user_id, user_name: currentUser.user_name })
              notification.success({
                message: `Success`,
                placement: 'bottomRight',
                description: 'The quote has been send successfully. ',
              })
              refetch()
            }}
            className={button}
            style={{
              backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
      <Modal
        open={openDelete}
        onOk={() => setOpenDelete(false)}
        okButtonProps={{
          style: {
            display: 'none',
          },
        }}
        cancelButtonProps={{
          style: {
            display: 'none',
          },
        }}
        onCancel={() => setOpenDelete(false)}
        width={600}
        centered
        destroyOnClose
      >
        <Typography.Title level={4} style={{ fontWeight: 'bold' }}>You sure want to delete the quote?</Typography.Title>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            paddingTop: 30,
          }}
        >
          <Button
            className={button}
            onClick={() => {
              setOpenDelete(false)
            }}
          >
            Cancel
          </Button>
          <Button
            type='primary'
            onClick={() => {
              setOpenDelete(false)
              deleteQuote({ quoteId: currentUser.quote_id })
              notification.success({
                message: `Success`,
                placement: 'bottomRight',
                description: 'The quote has been deleted successfully.',
              })
              setTimeout(() => {
                refetch()
              }, 1000);
            }}
            className={button}
            style={{
              backgroundImage: 'linear-gradient(to right,#ef3d4e,#ae2865)'
            }}
          >
            Ok
          </Button>
        </div>
      </Modal>
    </>
  )
}
