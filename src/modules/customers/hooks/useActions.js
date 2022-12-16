import { useSearchParams } from 'react-router-dom'

export const useActions = () => {
  let [searchParams, setSearchParams] = useSearchParams()

  const customerId = searchParams.get('id')
  const screen = searchParams.get('screen')

  const onOpen = ({ id, screen }) => {
    setSearchParams({
      id,
      screen,
    })
  }

  const onClose = () => {
    setSearchParams({})
  }

  return {
    customerId,
    screen,

    onClose,
    onOpen,
  }
}
