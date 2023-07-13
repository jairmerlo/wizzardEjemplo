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
      <Tooltip title='Edit' className='itemGridToolbox'>
        <button className='itemButtonActions' onClick={handleOpen}>
          <span className='back-office-add-user' style={{ fontSize: '20px' }}></span>
          EDIT
        </button>
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
