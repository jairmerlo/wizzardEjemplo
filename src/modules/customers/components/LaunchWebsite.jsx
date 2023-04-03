import { EyeTwoTone } from '@ant-design/icons'
import { Modal, Space, Table, Tooltip } from 'antd'

import moment from 'moment'
import { useLayoutEffect, useState } from 'react'
import { useGetLaunchWebsiteQuery } from '../../../app/api/backoffice'
import { getColumnProps, showTotal } from '../../../helpers'

export const LaunchWebsite = ({ registrationKey }) => {

    const { data: launchWebsite } = useGetLaunchWebsiteQuery({ registration_key: registrationKey })

    console.log({ launchWebsite })

    const columns = [
        {
            ...getColumnProps({
                title: 'Date',
                dataIndex: 'date',
            }),
            render(text, { date }) {
                return <td>{moment(date).format('ll')}</td>
            }
        },
        {
            ...getColumnProps({
                title: 'Domain',
                dataIndex: 'domain',
            })
        },
        {
            ...getColumnProps({
                title: 'Provider',
                dataIndex: 'provider',
            })
        },
        {
            ...getColumnProps({
                title: 'IP',
                dataIndex: 'ip',
            })
        },
    ]

    return (
        <>
            <Table
                rowKey='id'
                size='small'
                columns={columns}
                dataSource={launchWebsite}
                bordered
                pagination={{
                    showTotal,
                }}
            />
        </>
    )
}
