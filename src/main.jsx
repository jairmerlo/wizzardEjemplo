import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import 'antd/dist/reset.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('react_backoffice')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
