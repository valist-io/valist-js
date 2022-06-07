import React from 'react';
import { JsonRpcProvider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { SetUseState } from '../../utils/Account/types';
import { store } from '../../app/store';
import { setName } from '../ens/ensSlice';

export class Web3ContextInstance {                                                                                                         
  public mainnet: JsonRpcProvider;
  public setMainnet: SetUseState<JsonRpcProvider>;

  constructor(
    mainnet: JsonRpcProvider,
    setMainnet: SetUseState<JsonRpcProvider>,
  ) {
		this.mainnet = mainnet;
    this.setMainnet = setMainnet;
	}

  async reverseEns (address: string) {
    const { nameByAddress } = store.getState().ens;

    if (address in nameByAddress) {
      return nameByAddress[address];
    }

    try {
      const name = await this.mainnet.lookupAddress(address);
      if (name !== null) {
        store.dispatch(setName({ name: name, address:address }));
        return name;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
    return null;
  };

  async resolveEns (ens: string)  {
    const { addressByName } = store.getState().ens;

    if (ens in addressByName) {
      return addressByName[ens];
    }

    try {
      const address = await this.mainnet.resolveName(ens);
      if (address !== null) {
        store.dispatch(setName({ name: ens, address: address }));
        return address;
      }
    } catch (err) {
      console.log(err);
    }
    return null;
  };

  async isValidAddress (addressOrENS: string) {
    let address: string | null = addressOrENS;
    if (address.endsWith('.eth')) {
      address = await this.resolveEns(address);
    }
    const isAddress = address && ethers.utils.isAddress(address);

    if (isAddress) return address;
    return null;
  };
};

export default React.createContext<Web3ContextInstance>(new Web3ContextInstance(
  new ethers.providers.JsonRpcProvider('https://rpc.valist.io/ens'),
  () => {},
));
