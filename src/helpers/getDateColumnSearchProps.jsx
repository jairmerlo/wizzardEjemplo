import { SearchOutlined } from '@ant-design/icons'
import { Button, DatePicker, Space } from 'antd'
import moment from 'moment'

export const getDateColumnSearchProps = ({
  dataIndex,
  onSearch,
  onReset,
  initialFormat,
  finalFormat,
}) => ({
  filterDropdown: ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    clearFilters,
  }) => (
    <div
      style={{ padding: 8, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      <DatePicker
        value={selectedKeys[0]}
        onChange={e => {
          console.log(e.format('DD-MM-YYYY'))
          setSelectedKeys([e])
        }}
        allowClear={true}
        style={{ width: '100%' }}
      />
      <Space>
        <Button
          type='primary'
          onClick={() => onSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size='small'
          style={{ width: 90 }}
        >
          Search
        </Button>
        <Button
          onClick={() => onReset(clearFilters, confirm, dataIndex)}
          size='small'
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </Space>
    </div>
  ),
  filterIcon: filtered => (
    <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  ),
  onFilter: (value, record) => {
    console.log({
      cell: moment(moment(record[dataIndex], initialFormat)).format(
        'DD-MM-YYYY',
      ),
      value: value.format('DD-MM-YYYY'),
    })
    return (
      moment(moment(record[dataIndex], initialFormat)).format('DD-MM-YYYY') ===
      value.format('DD-MM-YYYY')
    )
  },
  render: date => moment(moment(date, initialFormat)).format(finalFormat),
})
