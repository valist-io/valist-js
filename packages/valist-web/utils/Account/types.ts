import React from 'react';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from 'ethers';
import { Magic } from 'magic-sdk';

export type SetUseState<T> = React.Dispatch<React.SetStateAction<T>>;

export type LoginType = 'readOnly' | 'metaMask' | 'walletConnect' | 'magic';

export type ValistProvider = ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider | WalletConnectProvider | MetaMaskInpageProvider;

export type Login = (
  loginType:LoginType,
  setLoginType: SetUseState<LoginType>,
  setProvider: SetUseState<ValistProvider>, 
  setAddress: SetUseState<string>,
  setMagic: SetUseState<Magic | null>,
  email: string,
) => Promise<void>;

export type Logout = (
  loginType:LoginType,
  setLoginType: SetUseState<LoginType>,
  setAddress: SetUseState<string>,
  Magic: Magic,
) => Promise<void>

export type AccountCtxType = {
  address: string,
  loginType: LoginType,
  magic: Magic,
  setLoginType: SetUseState<LoginType>,
  setShowLogin: SetUseState<boolean>,
  setAddress: SetUseState<string>,
  setMagic: SetUseState<Magic | null>,
};

export interface AccountCtxInterface {
  address: string,
  loginType: LoginType,
  magic: Magic | null,
  setLoginType: SetUseState<LoginType>,
  setShowLogin: SetUseState<boolean>,
  setAddress: SetUseState<string>,
  setMagic: SetUseState<Magic | null>,
}