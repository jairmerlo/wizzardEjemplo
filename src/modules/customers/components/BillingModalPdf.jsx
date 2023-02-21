import { Descriptions, Modal, Segmented, Typography } from 'antd'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { AuthorizationForms } from '.'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
import { useGetAuthorizationFormsQuery, useGetPdfInvoiceQuery } from '../../../app/api/billing'
import { getConfig, stringAvatar, stringFallback } from '../../../helpers'
import { BillinHistory } from './BillinHistory'
import { BillinInformation } from './BillinInformation'

export const BillingModalPdf = ({id, isModalOpen, handleOk, handleCancel}) => {

    const {
        data: pdfData = [],
        isLoading,
        refetch: refetchPDF,
      } = useGetPdfInvoiceQuery(
        { id: id },
        {
          skip: !id,
        },
      )

      console.log('pdf data', pdfData)
 
  return (
    
    <Modal
    title='Payment Billing Information'
    width='50%'
    style={{ height: '20px' }}
    open={isModalOpen}
    footer={[]}
    onOk={handleOk}
    onCancel={handleCancel}
  >      
    {!isLoading && (
        <p>{pdfData.url}</p>
    //   <object
    //     data={pdfData.url}
    //     type='application/pdf'
    //     style={{ width: '100%', height: '700px' }}
    //   >
    //     <iframe
    //      frameborder="0"
    //       width={'100%'}
    //       title='pdf'
    //       src={`https://docs.google.com/viewer?url=${pdfData.url}&embedded=true`}
    //     ></iframe>
    //   </object>
    )}
  </Modal>
  )
}
