import { Table } from 'antd'

import { useBillingInformationQuery } from '../../../app/api/billing'

import { getColumnProps, showTotal } from '../../../helpers'

export const BillinInformation = ({
  achData = [],
  cardData = [],
  userId,
  registrationKey,
  onSuccess = f => f,
}) => {
  const { data: billinInformation = [], isLoading: isLoadingInformation } =
    useBillingInformationQuery(
      { registration_key: registrationKey },
      {
        skip: !registrationKey,
      },
    )
  console.log({ billinInformation })
  const rows = []

  rows.push(billinInformation)

  const columns = [
    {
      ...getColumnProps({
        title: 'Payment Method',
        dataIndex: 'payment_method',
      }),
    },
    {
      ...getColumnProps({
        title: 'Number',
        dataIndex: 'payment_method',
      }),
      render(
        text,
        { completed_at, create_at, payment_method, account_number, number },
      ) {
        if (payment_method === 'ACH') return <div>******{account_number}</div>
        return <div>******{number}</div>
      },
    },
  ]

  if (rows.length > 0) {
    if (rows[0].payment_method === 'Card') {
      columns.push({
        ...getColumnProps({
          title: 'Expires',
          dataIndex: '',
        }),
        render(text, { month, year }) {
          if (month && year) return <div>{`${month} / ${year}`}</div>
        },
      })
    }
  }

  return (
    <Table
      rowKey='id'
      size='small'
      columns={columns}
      dataSource={rows}
      bordered
      pagination={{
        showTotal,
      }}
      loading={isLoadingInformation}
    />
  )
}
