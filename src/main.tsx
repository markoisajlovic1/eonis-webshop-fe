import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { store } from './store/store'
import { router } from './routes/router.tsx'
import { initializeAuth, logoutSuccess } from './store/slices/authSlice'
import { authService } from './services/authService'
import './index.css'

store.dispatch(initializeAuth())

window.addEventListener('auth:logout', () => {
  authService.logout().catch(() => {})
  store.dispatch(logoutSuccess())
})

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
