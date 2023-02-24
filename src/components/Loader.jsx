import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import React from 'react'

export const Loader = ({ size = 24 }) => {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Spin indicator={<LoadingOutlined style={{ fontSize: size }} spin />} />
    </div>
  )
}
