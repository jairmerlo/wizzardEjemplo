import { Modal } from 'antd'
import React from 'react'
import { useGetPdfInvoiceQuery } from '../../../app/api/billing'

export const BillingModalPdf = ({ id, isModalOpen, handleOk, handleCancel }) => {

  const {
    data: pdfData = [],
    isLoading,
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
