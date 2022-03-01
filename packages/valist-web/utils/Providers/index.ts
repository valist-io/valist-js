import WalletConnectProvider from '@walletconnect/web3-provider';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Magic } from 'magic-sdk';
import getConfig from 'next/config';
import { SetUseState } from '../Account/types';

const { publicRuntimeConfig } = getConfig();

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export const newMagic = () => {
  const customNodeOptions = {
    rpcUrl: publicRuntimeConfig.WEB3_PROVIDER,
  };

  return new Magic(publicRuntimeConfig.MAGIC_PUBKEY, { network: customNodeOptions });
};

export const addressFromProvider = async (provider: any) => {
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  return account;
};

export const providers = {
  walletConnect: async ({}) => {
    const wc = new WalletConnectProvider({
      rpc: {
        80001: publicRuntimeConfig.WEB3_PROVIDER,
      },
    });
    await wc.enable();    //  Enable session (triggers QR Code modal)
    return wc;
  },
  metaMask: async ({}) => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch(err) {
      console.log("Could not connect to MetaMask", err);
    }
      
    return window.ethereum;
  },
  magic: async (params: {email: string | null, setMagic: SetUseState<Magic | null>}) => {
    const { email } = params;
    const magic = newMagic();

    try {
      const magicLoggedIn = await magic.user.isLoggedIn();
      if (!magicLoggedIn && email) {
        await magic.auth.loginWithMagicLink({ email });
      }
    }catch(err){}

    params.setMagic(magic);
    return magic.rpcProvider;
  },
  readOnly: async ({}) => {
    return publicRuntimeConfig.WEB3_PROVIDER;
  },
};
