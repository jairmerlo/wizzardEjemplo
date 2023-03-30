import { EditTwoTone } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useState } from 'react'
import { MembershipEdit } from './MembershipEdit'
import '../../../icons/style.css'

export const EditMemberhipIcon = ({ registration_key }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <Tooltip title='Edit'>
        <a onClick={handleOpen} href>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              color: '#858faf',
              fontSize: '10px'
            }}
          >
            <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
            EDIT
          </div>
        </a>
      </Tooltip>
      {open && (
        <MembershipEdit
          registration_key={registration_key}
          open={open}
          onClose={handleClose}
        />
      )}
    </>
  )
}
