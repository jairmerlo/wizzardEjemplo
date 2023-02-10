const {
  VITE_APP_API_BILLING_HOST,
  VITE_APP_API_PACKAGE_BUILDER,
  VITE_APP_API_BACKOFFICE,
} = import.meta.env

export const API = {
  _BILLING_HOST:
    window.API_BILLING_HOST && VITE_APP_API_BILLING_HOST + window.MODE + '/api',
  _PACKAGE_BUILDER:
    window.API_PACKAGE_BUILDER &&
    VITE_APP_API_PACKAGE_BUILDER + window.MODE + '/api',
  _BACKOFFICE:
    window.API_BACKOFFICE &&
    VITE_APP_API_BACKOFFICE + window.MODE + '/tgapi/api',
}
