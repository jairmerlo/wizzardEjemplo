import { Modal, Tooltip } from 'antd'
import { useState } from 'react'
import { useCss } from 'react-use'
import { useGetLastActionsMembershipQuery } from '../../../app/api/backoffice'
import { Loader } from '../../../components'

export const LastActionCell = ({
  text,
  date = '',
  isHighlighted,
  highlightedText,
  registration_key,
  membershipId,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { data = [], isLoading } = useGetLastActionsMembershipQuery(
    {
      registration_key,
    },
    {
      skip: !registration_key || !open,
    },
  )

  // console.log({ data })

  const table = useCss({
    borderRadius: '8px',
    width: '100%',
    overdflowY: 'auto',
    border: '1px solid rgba(5, 5, 5, 0.06)',
    '& td': {
      padding: '16px 24px',
      border: '1px solid rgba(5, 5, 5, 0.06)',
      textAlign: 'center',
    },
    '& th': {
      padding: '16px 24px',
      border: '1px solid rgba(5, 5, 5, 0.06)',
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
      fontWeight: 600,
    },
  })
  return (
    <>
      <button className='buttonLink' onClick={handleOpen}>
        <Tooltip title={text}>
          <p
            style={{
              whiteSpace: 'pre-wrap',
              textAlign: 'start'
            }}
          >
            {text}
            <br />
            {date}
          </p>
        </Tooltip>
      </button>
      <Modal
        title={'Timeline Membership: ' + membershipId}
        open={open}
        //   onOk={handleOk}
        onCancel={handleClose}
        destroyOnClose
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
      >
        {isLoading ? (
          <Loader />
        ) : data?.length === 0 ? (
          'Data is empty'
        ) : (
          <table className={table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Last Action</th>
              </tr>
            </thead>
            <tbody>
              {data.map(item => (
                <>
                  <tr>
                    <td>{item.created_at}</td>
                    <td>{item.action}</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        )}
      </Modal>
    </>
  )
}
