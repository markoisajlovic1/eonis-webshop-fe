import { useEffect } from 'react'
import './App.css'
import Header from './components/user/Header'
import Footer from './components/user/Footer'
import { Navigate, Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store/store'
import { setCount } from './store/slices/cartSlice'
import { setWishlist, clearWishlist } from './store/slices/wishlistSlice'
import { cartService } from './services/cartService/cartService'
import { cartServiceLS } from './services/cartService/cartServiceLS'
import { wishlistService } from './services/wishlistService'
import { Role } from './types/auth'

function App() {
  const dispatch = useDispatch()
  const { userId, role, initializing } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    // setovanje cat-a i wishilist u za redux
    if (userId) {
      cartService.getByUserId(userId)
        .then(items => dispatch(setCount(items.length)))
        .catch(console.error)

      wishlistService.getByUserId(userId, { pageSize: 1000 })
        .then(result => dispatch(setWishlist(result.items.map(p => p.productId))))
        .catch(console.error)
    } else {
      dispatch(setCount(cartServiceLS.getAll().length))
      dispatch(clearWishlist())
    }
  }, [userId])


  // redirektujemo admina na /admin jer i customer i neulogovani user, samo oni mogu da pristupe '/'

  // jos jedna stvar, ako ne uradim ovo u adminsidebar komponenti -> dispatch(logoutSuccess()) desio bi se bag da bi sledeca linije redirektovana na '/' i onda bi doslo dovde i opet bi ga vracao na admin panel
  if (!initializing && role === Role.Employee) return <Navigate to="/admin" replace />

  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      <Header />
      <main className='flex-1 flex flex-col'>
        <Outlet />
      </main>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App
