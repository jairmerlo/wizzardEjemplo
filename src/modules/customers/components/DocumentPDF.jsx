import { EyeTwoTone } from '@ant-design/icons'
import React from 'react'
import { useGetPdfQuery } from '../../../app/api/billing'

export const DocumentPDF = id => {
  const { data: { url_pdf } = {} } = useGetPdfQuery(id, {
    skip: !id,
  })
  console.log({ url_pdf })
  return (
    <a href={url_pdf} target='_blank' rel='noreferrer'>
      <EyeTwoTone style={{ fontSize: '18px' }} />
    </a>
  )
}
