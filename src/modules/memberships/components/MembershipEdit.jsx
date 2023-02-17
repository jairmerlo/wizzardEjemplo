import { EditTwoTone, ExclamationCircleFilled } from '@ant-design/icons'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  Modal,
  Spin,
  Tooltip,
  Tree,
  Typography,
} from 'antd'
import { ErrorMessage, Formik } from 'formik'
import { useState } from 'react'
import { useCss } from 'react-use'
import { useGetMembershipQuery } from '../../../app/api/backoffice'
const treeData = [
  {
    title: 'Website Builder',
    key: '0-0',
    children: [
      {
        title: 'Has CMS Team',
        key: '0-0-0',
      },
      {
        title: 'Property Sites',
        key: '0-0-1',
      },
    ],
  },
]

const treeDataIDX = [
  {
    title: 'IDX Integration',
    key: '0-0',
    children: [
      {
        title: 'Map Search Filters',
        key: '0-0+0',
      },
      {
        title: 'Display Filters',
        key: '0-0-0',
      },
      {
        title: 'My Buildings',
        key: '0-0-1',
      },
      {
        title: 'Commercial Filters',
        key: '0-0-2',
      },
    ],
  },
]

const treeHasVacationRentals = [
  {
    title: 'Has Vacation Rentals',
    key: '0-0',
    children: [
      { title: "Listing Agent's CC Email", key: '0-0-0' },
      { title: 'Has Home Page Vacation Rentals Quick Search', key: '0-0-1' },
    ],
  },
]

const treeLeadGeneration = [
  {
    title: 'Lead Generation',
    key: '0-0',
    children: [
      {
        title: 'Boost Conversion Tool',
        key: '0-0-1',
      },
      {
        title: 'Boost Nurture',
        key: '0-0-2',
      },
      {
        title: 'IDXBoost Box Ads',
        key: '0-0-3',
      },
      {
        title: 'Cms Landing / Forms',
        key: '0-0-4',
      },
    ],
  },
]

const treeOthers = [
  {
    title: 'Quiz After Registration',
    key: '0-0',
  },
  {
    title: 'SMS',
    key: '0-1',
  },
  {
    title: 'Hot Sheet Autocreate User',
    key: '0-2',
  },
  {
    title: 'Alerts',
    key: '0-3',
  },
  {
    title: 'Generate Schema',
    key: '0-4',
  },
]

export const MembershipEdit = ({ registration_key }) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const { confirm } = Modal
  const form = useCss({
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    columnGap: '16px',
    rowGap: '30px',
    '& > .ant-form-item': {
      margin: '0px',
    },
    '@media only screen and (max-width: 745px)': {
      gridTemplateColumns: '1fr',
    },
  })
  const { data, isLoading } = useGetMembershipQuery(
    { registration_key },
    {
      skip: !open,
    },
  )
  console.log({ data })
  return (
    <>
      <Tooltip title='Edit'>
        <a onClick={handleOpen}>
          <EditTwoTone style={{ fontSize: '18px' }} />
        </a>
      </Tooltip>
      <Modal
        title='Membership ID: '
        open={open}
        //   onOk={handleOk}
        onCancel={handleClose}
        width={800}
        centered
        destroyOnClose
      >
        <Divider />
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Spin tip='Loading' size='large' />
          </div>
        ) : (
          <Formik>
            {() => (
              <>
                <Form layout='vertical' autoComplete='off'>
                  <Typography.Title level={5}>
                    Installation Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Company Template'>
                      <Input placeholder='Company Template' />
                    </Form.Item>
                    <Form.Item label='Template Name'>
                      <Input placeholder='Template Name' />
                    </Form.Item>
                    <Form.Item label='Cpanel Username'>
                      <Input placeholder='Cpanel Username' />
                    </Form.Item>
                    <Form.Item label='Cpanel Password'>
                      <Input.Group compact>
                        <Input
                          style={{ width: 'calc(100% - 31px)' }}
                          placeholder='Cpanel Password'
                          type='password'
                        />
                        <Button
                          icon={<EditTwoTone />}
                          onClick={() => {
                            confirm({
                              title:
                                "Are you sure you want to update the user's password? Old password will be removed",
                              icon: <ExclamationCircleFilled />,
                            })
                          }}
                        />
                      </Input.Group>
                    </Form.Item>
                    <Form.Item label='WordPress Install Name'>
                      <Input placeholder='WordPress Install Name' />
                    </Form.Item>
                    <Form.Item label='WordPress Username'>
                      <Input placeholder='WordPress Username' />
                    </Form.Item>
                    <Form.Item label='Original WordPress URL'>
                      <Input placeholder='Original WordPress URL' />
                    </Form.Item>
                    <Form.Item label='WordPress URL'>
                      <Input placeholder='WordPress URL' />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    Membership's Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Cpanel Registration Key'>
                      <Input placeholder='Cpanel Registration Key' />
                    </Form.Item>
                    <Form.Item label='IP Configuration'>
                      <Input placeholder='IP Configuration' />
                    </Form.Item>
                    <Form.Item label='Customer'>
                      <Input placeholder='Customer' />
                    </Form.Item>
                    <Form.Item label='Publication Date'>
                      <Input placeholder='Publication Date' type='date' />
                      <Checkbox>
                        <span
                          style={{
                            whiteSpace: 'nowrap',
                          }}
                        >
                          Production Mode
                        </span>
                      </Checkbox>
                    </Form.Item>
                    <Form.Item label='Google Recaptcha Public Key'>
                      <Input placeholder='Google Recaptcha Public Key' />
                    </Form.Item>
                    <Form.Item label='Google Maps API Key'>
                      <Input placeholder='Google Maps API Key' />
                    </Form.Item>
                    <Form.Item label='Google Recaptcha Private Key'>
                      <Input placeholder='Google Recaptcha Private Key' />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    Membership’s Team{' '}
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '16px' }}>
                    <Form.Item label='Profile Deployment Team'>
                      <Input placeholder='Profile Deployment Team' />
                    </Form.Item>
                    <Form.Item label='Profile Marketing Team'>
                      <Input placeholder='Profile Marketing Team' />
                    </Form.Item>
                    <Form.Item label='Profile Project Manager Team'>
                      <Input placeholder='Profile Project Manager Team' />
                    </Form.Item>
                  </div>
                  <Typography.Title level={5} style={{ marginTop: '24px' }}>
                    User Properties
                  </Typography.Title>
                  <Divider dashed />
                  <div className={form} style={{ gap: '0px' }}>
                    <Tree
                      checkable
                      // onExpand={onExpand}
                      // expandedKeys={expandedKeys}
                      // autoExpandParent={autoExpandParent}
                      // onCheck={onCheck}
                      // checkedKeys={checkedKeys}
                      // onSelect={onSelect}
                      // selectedKeys={selectedKeys}
                      treeData={treeData}
                    />
                    <Tree checkable treeData={treeLeadGeneration} />
                    <Tree checkable treeData={treeDataIDX} />
                    <Tree checkable treeData={treeHasVacationRentals} />
                    <Tree checkable treeData={treeOthers} />
                  </div>
                </Form>
              </>
            )}
          </Formik>
        )}
      </Modal>
    </>
  )
}
