import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider.jsx'
import { SelectedDogProvider } from './context/SelectedDogProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SelectedDogProvider>
          <App />
        </SelectedDogProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
