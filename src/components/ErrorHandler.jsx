import { Alert } from 'antd'

export const ErrorHandler = ({ description, style }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: 8,
        ...style,
      }}
    >
      <Alert message='Error' description={description} type='error' showIcon />
    </div>
  )
}
