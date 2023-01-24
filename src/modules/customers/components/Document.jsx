import { useParams } from 'react-router-dom'
import {
  useGetAuthorizationFormsQuery,
  useGetCustomerQuery,
} from '../../../app/api/billing'

export const Document = () => {
  const { membershipId, customerId, formType } = useParams()
  const { data: customer = {}, isLoading: isLoadingCustomer } =
    useGetCustomerQuery(customerId)
  const { memberships = [] } = customer
  const membership = memberships.find(item => item.id === membershipId)
  const { data: authorizationForms = [], isLoading: isLoadingAuthForms } =
    useGetAuthorizationFormsQuery(
      {
        registration_key: membership?.registration_key,
        authorization_form_type: formType,
        order: 'id desc',
      },
      {
        skip: !membership,
      },
    )
  const document = authorizationForms.find(
    item => item.status === 'Completed' && item.is_principal === '1',
  )?.document
  if (isLoadingAuthForms || isLoadingCustomer) return 'Loading...'
  if (!document) return '404 Not Found'
  return (
    <div
      dangerouslySetInnerHTML={{
        __html: document,
      }}
    />
  )
}
