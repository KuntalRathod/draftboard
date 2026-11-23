import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { PrivacyPolicy } from './components/PrivacyPolicy.tsx'
import { Landing } from './components/Landing.tsx'
import { initAnalytics } from './lib/analytics.ts'

const path = window.location.pathname.replace(/\/+$/, '') || '/'

initAnalytics()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {path === '/privacy' ? <PrivacyPolicy /> : path === '/' ? <Landing /> : <App />}
  </StrictMode>,
)
