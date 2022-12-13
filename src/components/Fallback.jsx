import { Spin } from 'antd'
import React from 'react'

export const Fallback = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 8,
      }}
    >
      <Spin tip='Loading' size='large' />
    </div>
  )
}
