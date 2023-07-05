import { Modal } from 'antd'
import React from 'react'
import { useState } from 'react'
import { useCss } from 'react-use'

export const AFTimeLine = ({
  completed_at,
  create_at,
  authorization_form_type,
  history = [],
}) => {
  // console.log({ history })
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const table = useCss({
    borderRadius: '8px',
    width: '100%',
    overdflowY: 'auto',
    border: '1px solid rgba(5, 5, 5, 0.06)',
    '& td': {
      padding: '16px 24px',
      border: '1px solid rgba(5, 5, 5, 0.06)',
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
      <button className='buttonLink' onClick={handleOpen}>{completed_at || create_at}</button>
      <Modal
        title={`Timeline. Authorization Form: ${authorization_form_type === 'ACH' ? 'ACH' : 'Credit Card'
          }`}
        open={open}
        okButtonProps={{ style: { display: 'none' } }}
        cancelButtonProps={{ style: { display: 'none' } }}
        onCancel={handleClose}
      >
        <table className={table}>
          <thead>
            <tr>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map(item => (
              <>
                {item.completed_at && (
                  <tr>
                    <td>Completed</td>
                    <td>{item.completed_at + ' UTC+0'}</td>
                  </tr>
                )}
                <tr>
                  <td>Waiting for Client </td>
                  <td>{item.create_at + ' UTC+0'}</td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </Modal>
    </>
  )
}
