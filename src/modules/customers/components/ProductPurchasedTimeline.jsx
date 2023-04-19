import { Modal, Space, Table, Tooltip } from "antd"
import { useGetMembershipQuery } from "../../../app/api/backoffice"

import {
    getColumnProps,
    showTotal,
} from '../../../helpers'
import { useLayoutEffect, useState } from "react"
import { CopyOutlined, EyeTwoTone } from "@ant-design/icons"
import { useGetHtmlWizardQuery, useListAgreementByRegkeyQuery } from "../../../app/api/billing"

export const ProductPurchasedTimeline = ({ registration_key }) => {

    const { data: wizard, isLoading } = useGetHtmlWizardQuery(
        { registration_key },
    )

    const rows = []
    rows.push(wizard)

    console.log({ rows })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [pdfs, setPdfS] = useState([])
    const [views, setViews] = useState([])

    const handleViewPdf = id => {
        // setPdfS([])
        // setIsModalOpen(true)
        // const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
        //   method: 'get',
        // }).then(res => res.json())
        // setPdfS(res)

        if (rows.find(data => data.id === id)) {
            setPdfS(rows.find(data => data.id === id))
        } else {
            setPdfS([])
        }

        setIsModalOpen(true)
    }

    const handleView = id => {
        // setPdfS([])
        // setIsModalOpen(true)
        // const res = await fetch(API._BILLING_HOST + '/get-invoice-pdf/' + id, {
        //   method: 'get',
        // }).then(res => res.json())
        // setPdfS(res)

        if (rows.find(data => data.id === id)) {
            setPdfS(rows.find(data => data.id === id))
        } else {
            setPdfS([])
        }

        setModalView(true)
    }

    useLayoutEffect(() => {
        let elemento = document.getElementsByClassName('content')

        if (elemento[0]) {
            elemento[0].parentElement.remove()
        }

        Array.from(document.getElementsByTagName('p')).forEach(element => {
            if (
                element.innerHTML === '&nbsp;' ||
                element.innerHTML === '[@signature]'
            ) {
                console.log('removed')
                element.remove()
            }
        })
    }, [pdfs])

    const columns = [
        {
            ...getColumnProps({
                title: 'Product/Service',
                dataIndex: 'classAccountingName',
            })
        },
        {
            ...getColumnProps({
                title: 'Initial Price',
                dataIndex: 'initial_price',
            })
        },
        {
            ...getColumnProps({
                title: 'Monthly Price',
                dataIndex: 'monthly_price',
            })
        },
        {
            ...getColumnProps({
                title: 'Date',
                dataIndex: 'create_at',
            })
        },
        {
            title: 'Agreement',
            dataIndex: 'actions',
            render: (text, render) => (
                <Tooltip
                    title='Details'
                    onClick={() => handleViewPdf(render.id)}
                >
                    <CopyOutlined style={{ fontSize: '18px' }} />
                </Tooltip>
            ),
        },
        {
            title: 'View',
            dataIndex: 'actions',
            render: (text, render) => (
                <Tooltip
                    title='Details'
                    onClick={() => handleView(render.id)}
                >
                    <EyeTwoTone style={{ fontSize: '18px' }} />
                </Tooltip>
            ),
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

            <Modal
                title=''
                width='50%'
                style={{ height: '20px', top: '10px' }}
                open={isModalOpen}
                footer={[]}
                onOk={() => setIsModalOpen(false)}
                onCancel={() => setIsModalOpen(false)}
            >
                {pdfs.agreement_content && (
                    <>
                        <div
                            dangerouslySetInnerHTML={{ __html: pdfs.agreement_content }}
                        ></div>

                        <div className='ms-wrapper-signature'>
                            <span className='ms-siganture-text'>
                                {pdfs.membership_agreement_name}
                            </span>
                            <div className='ms-info-client'>
                                <span>{pdfs.token_date} </span>
                                <span></span>
                                <span>{pdfs.token}</span>
                            </div>
                        </div>

                        <p>[@signature]</p>
                    </>
                )}
            </Modal>

            <Modal
                title=''
                width='50%'
                style={{ height: '20px', top: '10px' }}
                open={modalView}
                footer={[]}
                onOk={() => setModalView(false)}
                onCancel={() => setModalView(false)}
            >
                {/* {pdfs.agreement_content && (
                    <>
                        <div
                            dangerouslySetInnerHTML={{ __html: pdfs.agreement_content }}
                        ></div>

                        <div className='ms-wrapper-signature'>
                            <span className='ms-siganture-text'>
                                {pdfs.membership_agreement_name}
                            </span>
                            <div className='ms-info-client'>
                                <span>{pdfs.token_date} </span>
                                <span></span>
                                <span>{pdfs.token}</span>
                            </div>
                        </div>

                        <p>[@signature]</p>
                    </>
                )} */}
                <h1>hola</h1>
            </Modal>

        </>
    )
}
