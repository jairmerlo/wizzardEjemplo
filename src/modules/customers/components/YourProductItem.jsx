import { Typography } from 'antd'

export const YourProductItem = ({ label, text, price, finalPrice }) => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography.Text style={{ fontWeight: 600, fontSize: 15 }}>
        {label}
      </Typography.Text>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {text ? (
          <Typography.Text style={{ fontWeight: 600, fontSize: 15 }}>
            {text}
          </Typography.Text>
        ) : (
          <>
            <Typography.Text
              style={{
                fontSize: 13,
                color: '#959595',
                textDecoration: 'line-through',
                fontWeight: 600,
                textAlign: 'right',
              }}
            >
              {price}
            </Typography.Text>
            <Typography.Text
              style={{
                fontWeight: 600,
                textAlign: 'right',
              }}
            >
              {finalPrice}
            </Typography.Text>
          </>
        )}
      </div>
    </div>
  )
}
