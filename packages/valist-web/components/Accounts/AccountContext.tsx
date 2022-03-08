import React from 'react';
import { AccountCtxInterface } from '../../utils/Account/types';

export default React.createContext<AccountCtxInterface>({
  magic: null,
  address: '0x0',
  loginType: 'readOnly',
  loginSuccessful: false,
  modal: false,
  resolveEns:() => { return new Promise(() => ''); },
  reverseEns:() => { return new Promise(() => ''); },
  resolveAddress:() => { return new Promise(() => ''); },
  setShowLogin: () => {},
  setLoginType: () => {},
  setAddress: () => {},
  setMagic: () => {},
  notify: (type: string, text?: string) => { return type + text; },
  dismiss: (type: string) => { console.log(type); },
  setModal: () => {},
});
