import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { Magic } from 'magic-sdk';
import { LoginType, SetUseState, ValistProvider } from '../../utils/Account/types';
import { Project } from '../../utils/Apollo/types';
import { isBrowser } from '../../utils/Browser';

export interface AccountState {
  loginType: LoginType;
  loginTried: boolean;
  address: string;
  magicAddress: string | null,
  accounts: Record<string, Project[]>;
  accountNames: string[];
  currentAccount: string;
  loading: boolean;
};

const initialState: AccountState = {
  loginType: isBrowser() && (localStorage.getItem('loginType') as LoginType) || 'readOnly',
  loginTried: false,
  address: '0x0',
  magicAddress: null,
  accountNames: [],
  accounts: {},
  currentAccount: '',
  loading: true,
};

interface LoginPayload {
  email?: string;
  loginType: LoginType;
  setProvider: SetUseState<ValistProvider>;
  setMagic?: SetUseState<Magic>;
};

interface LogoutPayload {
  magic: Magic | null;
  setProvider: SetUseState<ValistProvider>;
};

interface SetAccountsPayload {
  accounts: Record<string, Project[]>;
  accountNames: string[];
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoginType: (state, action: PayloadAction<LoginType>) => {
      state.loginType = action.payload;
    },
    setLoginTried: (state, action: PayloadAction<boolean>) => {
      state.loginTried = action.payload;
    },
    setAddress: (state, action: PayloadAction<string>) => {
      state.address = action.payload;
    },
    setMagicAddress: (state, action: PayloadAction<string | null>) => {
      state.magicAddress = action.payload;   
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

export const { setLoginType, setLoginTried, setAddress, setMagicAddress, setAccounts, setAccountNames, setCurrentAccount, setLoading } = accountsSlice.actions;
export const selectLoginType = (state: RootState) => state.account.loginType;
export const selectLoginTried = (state: RootState) => state.account.loginTried;
export const selectAddress = (state: RootState) => state.account.address;
export const selectMagicAddress = (state: RootState) => state.account.magicAddress;
export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectAccountNames = (state: RootState) => state.account.accountNames;
export const selectCurrentAccount = (state: RootState) => state.account.currentAccount;
export const selectLoading = (state: RootState) => state.account.loading;
export default accountsSlice.reducer;
