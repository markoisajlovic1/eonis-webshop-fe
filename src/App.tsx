import { useEffect } from 'react'
import './App.css'
import Header from './components/user/Header'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from './store/store'
import { setCount } from './store/slices/cartSlice'
import { setWishlist, clearWishlist } from './store/slices/wishlistSlice'
import { cartService } from './services/cartService/cartService'
import { cartServiceLS } from './services/cartService/cartServiceLS'
import { wishlistService } from './services/wishlistService'

function App() {
  const dispatch = useDispatch()
  const userId = useSelector((state: RootState) => state.auth.userId)

  useEffect(() => {
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

  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      <Header />
      <main className='flex-1 flex flex-col'>
        <Outlet />
      </main>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  )
}

export default App
