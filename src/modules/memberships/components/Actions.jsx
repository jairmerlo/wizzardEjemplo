import { Divider, Modal, Popover, Space, Tooltip, Typography } from 'antd'
import React from 'react'
import { EditMemberhipIcon } from './EditMembershipIcon'
import { Requesticon } from './Requesticon'
import { BillingEnrollment } from './BillingEnrollment'
import { Deleteicon } from './Deleteicon'
import { AddPayment } from './AddPayment'

export const Actions = ({
    open, handleClose, currentId, currentRegKey, billingCicle, membershipID = '', IdOMB = '',
}) => {
    return (
        <Modal
            title={`Membership ID: ${membershipID}`}
            open={open}
            //   onOk={handleOk}
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
            onCancel={handleClose}
            width={400}
            centered
            destroyOnClose
        >
            <Divider />
            <div className='modalActions'>
                <Popover
                    className='itemGridToolbox'
                    placement='bottom'
                    // title={text}
                    content={
                        <Space size='middle' direction='vertical'>
                            <Tooltip title='CPanel'>
                                <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/cpanel/${currentId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            color: '#000',
                                            fontSize: '15px'
                                        }}
                                    >
                                        <span className='back-office-rocket' style={{ fontSize: '20px' }}></span>
                                        CPanel
                                    </div>
                                </a>
                            </Tooltip>

                            <Tooltip title='Wordpress'>
                                <a href={`https://backoffice.idxboost${window.MODE}/customers/memberships/login/wordpress/${currentId}`} target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            color: '#000',
                                            fontSize: '15px'
                                        }}
                                    >
                                        <span className='back-office-wordpress' style={{ fontSize: '20px' }}></span>
                                        Wordpress
                                    </div>
                                </a>
                            </Tooltip>


                            {/* <Cpanelicon registration_key={registration_key} /> */}

                            {/* eslint-enable jsx-a11y/anchor-is-valid */}
                        </Space>
                    }
                    trigger='click'
                >
                    <Tooltip title='Login'>
                        <div
                            className='itemButtonActions'
                        >
                            <span className='back-office-key' style={{ fontSize: '20px' }}></span>
                            LOGIN
                        </div>
                    </Tooltip>
                </Popover>


                <Tooltip title='Details' className='itemGridToolbox'>
                    <a
                        href={`${window.location.origin}/customers/v2/customers#/membership-details/${currentRegKey}`}
                        className='itemButtonActions'
                    >
                        <span className='back-office-eye' style={{ fontSize: '20px' }}></span>
                        VIEW
                    </a>
                </Tooltip>
                <EditMemberhipIcon registration_key={currentRegKey} />

                <Requesticon registration_key={currentRegKey} id={currentId} />

                <Tooltip title='ONB' className='itemGridToolbox'>
                    <a
                        href={`${window.location.origin}/clients/onBoarding/edit/${currentRegKey}/${IdOMB}`}
                        className='itemButtonActions'
                    >
                        <span className='back-office-menu' style={{ fontSize: '20px' }}></span>
                        ONB
                    </a>
                </Tooltip>
                <Tooltip title='Accounting classifications' className='itemGridToolbox'>
                    <a href={`${window.location.origin}/accounting/memberships/accounting_classification/${currentId}`} target='_blank'
                        rel='noreferrer'
                        className='itemButtonActions'
                    >
                        <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
                        <p style={{ textAlign: 'center' }}>ACCOUNTING
                            <br /> CLASSIFICATIONS</p>
                    </a>
                </Tooltip>
                {
                    !billingCicle && (
                        <BillingEnrollment registration_key={currentRegKey} />
                    )
                }
                <AddPayment registration_key={currentRegKey} />

                <Deleteicon registration_key={currentRegKey} />
            </div>
        </Modal>
    )
}
