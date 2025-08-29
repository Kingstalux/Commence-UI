import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FeatureFlagsState {
  burstCheckoutEnabled: boolean
  burstCheckoutCount: number
}

const initialState: FeatureFlagsState = {
  burstCheckoutEnabled: false,
  burstCheckoutCount: 5,
}

const featureFlagsSlice = createSlice({
  name: "featureFlags",
  initialState,
  reducers: {
    toggleBurstCheckout: (state) => {
      state.burstCheckoutEnabled = !state.burstCheckoutEnabled
    },
    setBurstCheckoutCount: (state, action: PayloadAction<number>) => {
      state.burstCheckoutCount = action.payload
    },
  },
})

export const { toggleBurstCheckout, setBurstCheckoutCount } = featureFlagsSlice.actions
export default featureFlagsSlice.reducer
