import { Alert } from 'antd'

export const ErrorHandler = () => {
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
      <Alert
        message='Error'
        description='You have not imported any components.'
        type='error'
        showIcon
      />
    </div>
  )
}
