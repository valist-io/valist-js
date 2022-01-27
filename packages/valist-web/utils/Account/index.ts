import { Magic } from 'magic-sdk';
import { addressFromProvider, providers } from '../Providers';
import { ProviderParams } from '../Providers/types';
import { SetUseState, LoginType, ValistProvider } from './types';

export const logout = async (
  setLoginType: SetUseState<LoginType>,
  setAddress: SetUseState<string>,
  magic: Magic | null,
) => {
  window.localStorage.setItem('loginType', 'readOnly');
  if (magic) {
    await magic.user.isLoggedIn();
  }
  setAddress('0x0');
  setLoginType('readOnly');
};

export const login = async (
  loginType: LoginType,
  setLoginType: SetUseState<LoginType>, 
  setProvider: SetUseState<ValistProvider>, 
  setAddress: SetUseState<string>,
  setMagic: SetUseState<Magic | null>,
  email: string,
) => {
  try {
    let account = '0x0';
    let params: ProviderParams = { email: '', setMagic: () => {} };
    let provider;

    if (loginType === 'magic') {
      params = { 
        email,
        setMagic, 
      };
    }

    provider = await providers[loginType](params);
    setProvider(provider);

    if (loginType != 'readOnly') {
      account = await addressFromProvider(provider);
    }

    window.localStorage.setItem('loginType', loginType);
    setAddress(account);
    setLoginType(loginType);
  }catch(err) {}
};

export const onAccountChanged = (
  setLoginType: SetUseState<LoginType>,
  setProvider: SetUseState<ValistProvider>, 
  setAddress: SetUseState<string>,
  email: string,
) => {
  if (window && window.ethereum) {
    window.ethereum.on('accountsChanged', () => {
      const loginType = (localStorage.getItem('loginType') as LoginType);
      if (loginType === 'metaMask') {
        login(loginType, setLoginType, setProvider, setAddress, ()=>{}, email,);
      }
    });
  };
};

export const checkLoggedIn = (required:boolean, loginType:LoginType) => {
  if (required) {
    return (loginType !== 'readOnly') ? true : false;
  }
  return true;
};