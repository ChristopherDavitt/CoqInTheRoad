import { configureStore } from '@reduxjs/toolkit'

const defaultState = {
  coqBalance: '0',
  loading: false,
  // default ~100M MC.
  coqPrice: 0,
  allowance: '0',
  minBet: '0',
  treasuryBalance: '0',
  won: false,
  coqWon: '0',
  account: {
    address: undefined,
    connected: false,
    chainId: undefined,
  },
};
const reducer = (state = defaultState, action: any) => {
  switch (action.type) {
    case "UPDATE_COQ_PRICE":
      return { ...state, coqPrice: action.payload };
    case "UPDATE_BALANCE": 
      return { ...state, coqBalance: action.payload };
    case "UPDATE_ACCOUNT":
      return {...state, account: action.payload};
    case "UPDATE_ALLOWANCE":
      return {...state, allowance: action.payload};
    case "UPDATE_MIN_BET":
      return {...state, minBet: action.payload};
    case "UPDATE_TREASURY":
      return {...state, treasuryBalance: action.payload};
    case "UPDATE_WON":
      return {...state, won: action.payload};
    case "UPDATE_COQ_WON":
      return {...state, coqWon: action.payload};
    case "DISCONNECT_WALLET":
      return defaultState;
    case "LOADING":
      return {...state, loading: true}
    case "FINISH_LOADING":
      return {...state, loading: false}
    default:
      return state;
  }
};
export const makeStore = () => {
  return configureStore({
    reducer: reducer
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']