import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Regression from './Regression.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {window.location.pathname === '/regression' || window.location.pathname.endsWith('/regression.html') ? <Regression /> : <App />}
  </StrictMode>,
)
