import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface CartState {
  isOpen: boolean
  optimisticUpdates: Record<string, number>
}

const initialState: CartState = {
  isOpen: false,
  optimisticUpdates: {},
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    toggleCart: (state) => {
      state.isOpen = !state.isOpen
    },
    setCartOpen: (state, action: PayloadAction<boolean>) => {
      state.isOpen = action.payload
    },
    addOptimisticUpdate: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      state.optimisticUpdates[action.payload.id] = action.payload.quantity
    },
    clearOptimisticUpdate: (state, action: PayloadAction<string>) => {
      delete state.optimisticUpdates[action.payload]
    },
  },
})

export const { toggleCart, setCartOpen, addOptimisticUpdate, clearOptimisticUpdate } = cartSlice.actions
export default cartSlice.reducer
