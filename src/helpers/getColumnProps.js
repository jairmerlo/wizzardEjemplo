import { stringFallback } from '.'

export const getColumnProps = ({ title, dataIndex }) => {
  return {
    title,
    dataIndex,
    key: dataIndex,
    render: text => stringFallback(text),
  }
}
