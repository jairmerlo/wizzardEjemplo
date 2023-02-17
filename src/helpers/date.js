import moment from 'moment'

export const date = (
  date,
  initialFormat = 'MM/DD/YYYY',
  finalFormat = 'll',
) => {
  return moment(moment(date, initialFormat)).format(finalFormat)
}
