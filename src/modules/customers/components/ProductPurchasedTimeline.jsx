import { Button, DatePicker, Input, Modal, Space, Table, Tooltip } from "antd"

import {
    getColumnProps,
    renderTextHighlighter,
    showTotal,
} from '../../../helpers'
import { useLayoutEffect, useReducer, useRef, useState } from "react"
import { CopyOutlined, EyeTwoTone, SearchOutlined } from "@ant-design/icons"
import { useGetHtmlWizardQuery } from "../../../app/api/billing"
import { IDXWebsite } from "./IDXWebsite"
import { MembershipCreationSuccess } from "."
import moment from "moment"

const reducer = (state, newState) => ({ ...state, ...newState })
const SEARCH_TEXT_INITIAL_STATE = {
    product_service: null,
    create_at: null,
}

const SEARCHED_COLUMN_INITIAL_STATE = {
    product_service: null,
    create_at: null,
}

export const ProductPurchasedTimeline = ({ registration_key = 0 }) => {

    let { data: wizard = [], isLoading } = useGetHtmlWizardQuery(
        { registration_key },
    )

    console.log({ wizard })

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalView, setModalView] = useState(false)
    const [pdfs, setPdfS] = useState([])
    const [views, setViews] = useState([])
    const [searchText, setSearchText] = useReducer(
        reducer,
        SEARCH_TEXT_INITIAL_STATE,
    )
    const [searchedColumn, setSearchedColumn] = useReducer(
        reducer,
        SEARCHED_COLUMN_INITIAL_STATE,
    )
    const searchInput = useRef(null)
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText({ [dataIndex]: selectedKeys[0] })
        setSearchedColumn({ [dataIndex]: true })
    }
    const handleReset = (clearFilters, confirm, dataIndex) => {
        clearFilters()
        confirm({ closeDropdown: true })
        setSearchedColumn({ [dataIndex]: false })
        setSearchText({ [dataIndex]: '' })
    }

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

    const getColumnSortProps = dataIndex => {
        return {
            sorter: (a, b) => {
                return (a[dataIndex] || '').localeCompare(b[dataIndex] || '')
            },
            ellipsis: true,
        }
    }

    const getColumnSearchProps = dataIndex => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
            close,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={e => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() =>
                            clearFilters && handleReset(clearFilters, confirm, dataIndex)
                        }
                        size='small'
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) => {
            const text = record[dataIndex] || ''
            return text?.toString().toLowerCase().includes(value.toLowerCase())
        },
        onFilterDropdownOpenChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100)
            }
        },
        render: (text = '') =>
            renderTextHighlighter({
                text: text,
                isHighlighted: searchedColumn[dataIndex],
                highlightedText: searchText[dataIndex],
            }),
        width: 200,
    })
    // console.log(moment(moment('Jun 20, 2023 15:16:21')).format('DD-MM-YYYY'))

    const getDateColumnSearchProps = dataIndex => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}
            >
                <DatePicker
                    value={selectedKeys[0]}
                    onChange={e => {
                        // console.log(e.format('DD-MM-YYYY'))
                        setSelectedKeys([e])
                    }}
                    allowClear={true}
                    style={{ width: '100%' }}
                />
                <Space>
                    <Button
                        type='primary'
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => handleReset(clearFilters, confirm, dataIndex)}
                        size='small'
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: filtered => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            // console.log(moment(moment(record[dataIndex])).format('DD-MM-YYYY'))
            // console.log(value.format('DD-MM-YYYY'))
            return (
                moment(moment(record[dataIndex])).format('DD-MM-YYYY') ===
                value.format('DD-MM-YYYY')
            )
        },
    })

    const getCustomColumnSortProps = ({ sorter }) => {
        return {
            sorter,
            ellipsis: true,
        }
    }

    const columns = [
        {
            title: 'Name',
            dataIndex: 'product_service',
            ...getColumnSearchProps('product_service'),
            ...getColumnSortProps('product_service'),
            // defaultSortOrder: 'descend',
            width: 250
        },
        {
            title: 'Transaction date',
            dataIndex: 'create_at',
            ...getDateColumnSearchProps('create_at'),
            ...getCustomColumnSortProps({
                sorter: (a, b) => {
                    return moment(
                        moment(a.create_at || '01/01/1970 01:01:01', 'MM/DD/YYYY hh:mm:ss'),
                    ).diff(moment(b.create_at || '01/01/1970 01:01:01', 'MM/DD/YYYY hh:mm:ss'))
                },
            }),
            render: (text, render) => (
                <div>
                    {render.create_at} {render.end_date_trial ? `- ${render.end_date_trial}` : ''}
                </div>
            ),
            width: 250
            // defaultSortOrder: 'descend',
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
            width: 50
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
            width: 50
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
                        couponId={views.coupon_id}
                        couponName={views.coupon_name}
                        setupfeeAmount={views.coupon_data?.setupfee_amount}
                        monthlyfeeAmount={views.coupon_data?.monthlyfee_amount}
                        couponTypeSetupfee={views.coupon_data?.coupon_type_setupfee}
                        billingCycleDate={views.billing_cycle_date}
                    />
                    <IDXWebsite
                        title={views.program_title}
                        subtitle={views.program_subtitle}
                        description={views.program_description}
                        daysTrial={views.trial_length}
                    />
                </div>
            </Modal>

        </>
    )
}
