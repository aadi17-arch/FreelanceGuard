import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <SnackbarProvider 
        maxSnack={1} 
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionProps={{ timeout: 0 }}
      >
        <App />
      </SnackbarProvider>
    </AuthProvider>
  </StrictMode>,
)
