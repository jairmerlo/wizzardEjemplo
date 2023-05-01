import { Modal, Space, Table, Tooltip } from "antd"
import { useGetMembershipQuery } from "../../../app/api/backoffice"

import {
    getColumnProps,
    showTotal,
} from '../../../helpers'
import { useLayoutEffect, useState } from "react"
import { CopyOutlined, EyeTwoTone } from "@ant-design/icons"
import { useGetHtmlWizardQuery, useListAgreementByRegkeyQuery } from "../../../app/api/billing"
import { IDXWebsite } from "./IDXWebsite"
import { MembershipCreationSuccess } from "."

export const ProductPurchasedTimeline = ({ registration_key }) => {

    const { data: wizard, isLoading } = useGetHtmlWizardQuery(
        { registration_key },
    )

    console.log({ wizard })

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

        if (wizard.find(data => data.id === id)) {
            setPdfS(wizard.find(data => data.id === id))
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

        if (wizard.find(data => data.id === id)) {
            setViews(wizard.find(data => data.id === id))
        } else {
            setViews([])
        }

        setModalView(true)
    }
    console.log({ views })


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
                dataIndex: 'product_service',
            })
        },
        {
            ...getColumnProps({
                title: 'Initial Price',
                dataIndex: 'total_initial_payment',
            })
        },
        {
            ...getColumnProps({
                title: 'Monthly Price',
                dataIndex: 'montlhy_dues',
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
                dataSource={wizard}
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
                style={{ height: '20px', top: '15px' }}
                open={modalView}
                footer={[]}
                onOk={() => setModalView(false)}
                onCancel={() => setModalView(false)}
            >
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <MembershipCreationSuccess
                        name={views.full_name}
                        email={views.email}
                        phone={views.phone}
                        setupFee={views.setup_program}
                        monthlyFee={views.monthly_program}
                        billingFrecuency={views.billing_frecuency}
                        initialTerm={views.init_date}
                        paymentMethod={views.payment_method}
                        paymentMethodValue={views.payment_method_value}
                        creditCardFee={views.credit_card_fee}
                        processingSetupFee={views.processing_setup_fee}
                        processingMonthlyFee={views.processing_montlhy_fee}
                        totalInitialPayment={views.total_initial_payment}
                        monthlyDues={views.montlhy_dues}
                        addOns={views.add_ons}
                    />
                    <IDXWebsite
                        title={views.program_title}
                        subtitle={views.program_subtitle}
                        description={views.program_description}
                    />
                </div>
            </Modal>

        </>
    )
}
