import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';
import { AppThunk, RootState } from '../../app/store';
import { LoginType, SetUseState, ValistProvider } from '../../utils/Account/types';
import { Project } from '../../utils/Apollo/types';
import { isBrowser } from '../../utils/Browser';
import { addressFromProvider, defaultProvider, providers } from '../../utils/Providers';
import { ProviderParams } from '../../utils/Providers/types';

export interface AccountState {
  loginType: LoginType;
  loginTried: boolean;
  address: string;
  magicAddress: string | null,
  accounts: Record<string, Project[]>;
  accountNames: string[];
  currentAccount: string;
};

const initialState: AccountState = {
  loginType: isBrowser() && (localStorage.getItem('loginType') as LoginType) || 'readOnly',
  loginTried: false,
  address: '0x0',
  magicAddress: null,
  accountNames: [],
  accounts: {},
  currentAccount: '',
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
  currentAccount: string;
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
      state.currentAccount = action.payload.currentAccount;
    },
    setAccountNames: (state, action: PayloadAction<string[]>) => {
      state.accountNames = action.payload;
    },
    setCurrentAccount: (state, action: PayloadAction<string>) => {
      state.currentAccount = action.payload;
    },
  },
});

export function login(payload: LoginPayload): AppThunk {
  return async (dispatch) => {
    try {
      let account: string;
      let params: ProviderParams = {};

      if (payload.loginType === 'magic') {
        params = { 
          email: payload.email,
          setMagic: payload.setMagic,
        };
      }
       
      const providerURL = await providers[payload.loginType](params);

      if (payload.loginType !== 'readOnly') {
        const provider = new ethers.providers.Web3Provider(
          providerURL,
        );
        account = await addressFromProvider(provider);
        window.localStorage.setItem('loginType', payload.loginType);

        dispatch(setAddress(account));
        dispatch(setLoginType(payload.loginType));
        payload.setProvider(provider);
      }
      dispatch(setLoginTried(true));
    } catch (err) {
      console.log('error', err);
    }
  };
};

export function logout(payload: LogoutPayload): AppThunk {
  return async (dispatch) => {
    window.localStorage.setItem('loginType', 'readOnly');
    if (payload?.magic?.user) {
      await payload.magic.user.logout();
    }
    dispatch(setAddress('0x0'));
    dispatch(setLoginType('readOnly'));
    dispatch(setMagicAddress(null));
    payload.setProvider(defaultProvider);
  };
};

export const { setLoginType, setLoginTried, setAddress, setMagicAddress, setAccounts, setAccountNames, setCurrentAccount } = accountsSlice.actions;
export const selectLoginType = (state: RootState) => state.account.loginType;
export const selectLoginTried = (state: RootState) => state.account.loginTried;
export const selectAddress = (state: RootState) => state.account.address;
export const selectMagicAddress = (state: RootState) => state.account.magicAddress;
export const selectAccounts = (state: RootState) => state.account.accounts;
export const selectAccountNames = (state: RootState) => state.account.accountNames;
export const selectCurrentAccount = (state: RootState) => state.account.currentAccount;
export default accountsSlice.reducer;
