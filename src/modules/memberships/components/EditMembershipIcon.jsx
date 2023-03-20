import { EditTwoTone } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { useState } from 'react'
import { MembershipEdit } from './MembershipEdit'

export const EditMemberhipIcon = ({ registration_key }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <>
      <Tooltip title='Edit'>
        <a onClick={handleOpen} href>
          <EditTwoTone style={{ fontSize: '18px' }} />
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
