import React from 'react';
import { AccountCtxInterface } from '../../utils/Account/types';

export default React.createContext<AccountCtxInterface>({
  magic: null,
  address: '0x0',
  loginType: 'readOnly',
  setShowLogin: () => {},
  setLoginType: () => {},
  setAddress: () => {},
  setMagic: () => {},
});
