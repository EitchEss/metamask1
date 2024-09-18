import { createSlice } from '@reduxjs/toolkit';
import { Hex } from '@metamask/utils';
import { swapsSlice } from '../swaps/swaps';
import { SwapsTokenObject } from '../../../shared/constants/swaps';
import { SwapsEthToken } from '../../selectors';

export type BridgeState = {
  toChainId: Hex | null;
  fromToken: SwapsTokenObject | SwapsEthToken | undefined;
  toToken: SwapsTokenObject | SwapsEthToken | undefined;
  fromTokenInputValue: string | undefined;
};

const initialState: BridgeState = {
  toChainId: null,
  fromToken: undefined,
  toToken: undefined,
  fromTokenInputValue: undefined,
};

const bridgeSlice = createSlice({
  name: 'bridge',
  initialState: { ...initialState },
  reducers: {
    ...swapsSlice.reducer,
    setToChainId: (state, action) => {
      state.toChainId = action.payload;
      state.toToken = undefined;
    },
    setFromToken: (state, action) => {
      state.fromToken = action.payload;
      state.fromTokenInputValue = undefined;
    },
    setToToken: (state, action) => {
      state.toToken = action.payload;
    },
    setFromTokenInputValue: (state, action) => {
      state.fromTokenInputValue = action.payload;
    },
    resetInputFields: () => ({
      ...initialState,
    }),
    switchToAndFromInputs: (state, { payload }) => ({
      toChainId: payload,
      fromToken: state.toToken,
      toToken: state.fromToken,
      fromTokenInputValue: undefined,
    }),
  },
});

export { bridgeSlice };
export default bridgeSlice.reducer;
