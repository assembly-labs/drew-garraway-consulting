import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { UserProfileProvider } from './context/UserProfileContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProfileProvider>
      <App />
    </UserProfileProvider>
  </StrictMode>,
)
