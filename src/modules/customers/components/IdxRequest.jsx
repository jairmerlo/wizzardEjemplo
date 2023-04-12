import { Table } from "antd"
import { useGetRequestByregKeyQuery } from "../../../app/api/billing"
import { getColumnProps, showTotal } from '../../../helpers'

export const IdxRequest = ({ registration_key }) => {
    // console.log({ registration_key })
    const { data = [], isLoading } = useGetRequestByregKeyQuery({
        registration_key
    })

    const rows = []
    rows.push(data[0])

    const columns = [
        {
            ...getColumnProps({
                title: 'Status',
                dataIndex: 'status',
            }),
        },
        {
            ...getColumnProps({
                title: 'Real State Agent',
                dataIndex: 'agent_first_name',
            }),
            render(text, data) {
                return <td>{data?.agent_first_name} {data?.agent_last_name}</td>
            },
        },
        {
            ...getColumnProps({
                title: 'Broker Name',
                dataIndex: 'broker_first_name',
            }),
            render(text, data) {
                return <td>{data?.broker_first_name} {data?.broker_last_name}</td>
            },
        },
        {
            ...getColumnProps({
                title: 'Broker Phone',
                dataIndex: 'broker_phone_number',
            }),
        },
        {
            ...getColumnProps({
                title: 'Broker Email',
                dataIndex: 'broker_email',
            }),
        },
        {
            ...getColumnProps({
                title: 'MLS Board ID',
                dataIndex: 'board',
            }),
        },
        {
            ...getColumnProps({
                title: 'Board Name',
                dataIndex: 'board_name',
            }),
        },
        {
            ...getColumnProps({
                title: 'Broker Company',
                dataIndex: 'broker_company_name',
            }),
        },
    ]


    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={rows}
                bordered
                pagination={{
                    showTotal,
                }}
                loading={isLoading}
            />
        </>
    )
}
