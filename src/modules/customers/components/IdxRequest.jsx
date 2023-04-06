import { Table } from "antd"
import { useGetRequestByregKeyQuery } from "../../../app/api/billing"
import { getColumnProps, showTotal } from '../../../helpers'

export const IdxRequest = ({ registration_key }) => {
    // console.log({ registration_key })
    const { currentData = [], isLoading } = useGetRequestByregKeyQuery({
        // registration_key
    })

    // console.log(currentData)

    const columns = [
        {
            ...getColumnProps({
                title: 'Status',
                dataIndex: 'status',
            }),
        },
        // {
        //     ...getColumnProps({
        //         title: 'Real State Agent',
        //         dataIndex: 'agent_first_name',
        //     }),
        //     render(text, { agent_first_name, agent_last_name }) {
        //         return <td>{agent_first_name} {agent_last_name}</td>
        //     },
        // },
        // {
        //     ...getColumnProps({
        //         title: 'Broker Name',
        //         dataIndex: 'broker_first_name',
        //     }),
        //     render(text, { broker_first_name, broker_last_name }) {
        //         return <td>{broker_first_name} {broker_last_name}</td>
        //     },
        // },
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


    const rows = []
    rows.push(currentData[0])
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
