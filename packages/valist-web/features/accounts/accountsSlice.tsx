import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Project } from '../../utils/Apollo/types';

export interface AccountState {
  loginTried: boolean;
  address: string;
  accounts: Record<string, Project[]>;
  accountNames: string[];
  currentAccount: string;
  loading: boolean;
};

const initialState: AccountState = {
  loginTried: false,
  address: '0x0',
  accountNames: [],
  accounts: {},
  currentAccount: '',
  loading: true,
};

interface SetAccountsPayload {
  accounts: Record<string, Project[]>;
  accountNames: string[];
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoginTried: (state, action: PayloadAction<boolean>) => {
      state.loginTried = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setAccounts: (state, action: PayloadAction<SetAccountsPayload>) => {
      state.accounts = action.payload.accounts;
      state.accountNames = action.payload.accountNames;
    },
    setAccountNames: (state, action: PayloadAction<string[]>) => {
      state.accountNames = action.payload;
    },
    setCurrentAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoginTried, setAddress, setAccounts, setAccountNames, setCurrentAccount, setLoading } = accountsSlice.actions;
export const selectLoginTried = (state: RootState) => state.account.loginTried;
export const selectAddress = (state: RootState) => state.account.address;
export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectAccountNames = (state: RootState) => state.account.accountNames;
export const selectCurrentAccount = (state: RootState) => state.account.currentAccount;
export const selectLoading = (state: RootState) => state.account.loading;
export default accountsSlice.reducer;
