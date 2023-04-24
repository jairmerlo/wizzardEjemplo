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
    console.log({ rows })

    let columns = []

    if (rows[0]?.user_type === "agent") {
        columns = [
            {
                ...getColumnProps({
                    title: 'Status',
                    dataIndex: 'status',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Real Estate Agent',
                    dataIndex: 'user_type',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Agent Name',
                    dataIndex: 'agent_first_name',
                }),
                render(text, data) {
                    return <td>{data?.agent_first_name} {data?.agent_last_name}</td>
                },
            },
            {
                ...getColumnProps({
                    title: 'Agent Email',
                    dataIndex: 'agent_email',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Phone Number',
                    dataIndex: 'phone',
                }),
            },
            {
                ...getColumnProps({
                    title: 'MLS Board',
                    dataIndex: 'board_name',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Agent MLS ID',
                    dataIndex: 'board',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Broker Company Name',
                    dataIndex: 'broker_company_name',
                }),

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
                    title: 'Broker Email',
                    dataIndex: 'broker_email',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Broker Phone Number',
                    dataIndex: 'broker_phone_number',
                }),
            },
        ]
    } else {
        columns = [
            {
                ...getColumnProps({
                    title: 'Status',
                    dataIndex: 'status',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Real State Agent',
                    dataIndex: 'user_type',
                }),
            },
            {
                ...getColumnProps({
                    title: 'MLS Board',
                    dataIndex: 'board_name',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Agent MLS ID',
                    dataIndex: 'board',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Broker Company Name',
                    dataIndex: 'broker_company_name',
                }),
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
                    title: 'Broker Email',
                    dataIndex: 'broker_email',
                }),
            },
            {
                ...getColumnProps({
                    title: 'Broker Phone Number',
                    dataIndex: 'broker_phone_number',
                }),
            },
        ]

    }


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
