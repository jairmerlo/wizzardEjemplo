import { Typography } from 'antd'
import { IDXCard, IDXCardContent } from '.'
// import theme from '../../../theme'

export const IDXWebsite = ({ title = '', subtitle = '', description = '', daysTrial = 0 }) => {
  console.log({ daysTrial })
  return (
    <IDXCard style={{ width: '500px' }}>
      <IDXCardContent
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {
          daysTrial >= 1 && (
            <Typography.Title level={2} style={{ fontWeight: 'bold' }}>
              {daysTrial}-Days Free Trial
            </Typography.Title>
          )
        }
        <Typography.Title
          level={1}
          className='Title'
          style={{
            fontWeight: 'bold',
            margin: 0,
            color: '#cb315b'
          }}
        >
          {title}
        </Typography.Title>
        <Typography.Title level={4} style={{ fontWeight: 'bold', margin: 0 }}>
          {subtitle}
        </Typography.Title>
        {/* <Typography.Text> */}
        <div
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
        {/* {description} */}
        {/* </Typography.Text> */}
        {/* <IDXButton
          style={{ width: '100%', height: '50px' }}
          color='primaryColor'
          onClick={() => navigate('/confirm')}
        >
          CONTINUE
        </IDXButton> */}
        <Typography.Text
          style={{
            fontSize: 13,
            // color: theme.colors.gray,
            alignSelf: 'center',
          }}
        >
          @2023 IDXBoost, LLC All rights Reserved.
        </Typography.Text>
      </IDXCardContent>
    </IDXCard>
  )
}
