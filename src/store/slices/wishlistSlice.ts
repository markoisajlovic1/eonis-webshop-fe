import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface WishlistState {
  productIds: string[]
}

const initialState: WishlistState = {
  productIds: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist(state, action: PayloadAction<string[]>) {
      state.productIds = action.payload
    },
    addToWishlist(state, action: PayloadAction<string>) {
      if (!state.productIds.includes(action.payload)) {
        state.productIds.push(action.payload)
      }
    },
    removeFromWishlist(state, action: PayloadAction<string>) {
      state.productIds = state.productIds.filter(id => id !== action.payload)
    },
    clearWishlist(state) {
      state.productIds = []
    },
  },
})

export const { setWishlist, addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer
