import WalletConnectProvider from '@walletconnect/web3-provider';
import { MetaMaskInpageProvider } from "@metamask/providers";
import { Magic } from 'magic-sdk';
import getConfig from 'next/config';
import { SetUseState } from '../Account/types';
import { ValistProvider } from '../Account/types';

const { publicRuntimeConfig } = getConfig();

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}

export const newMagic = () => {
  const customNodeOptions = {
    rpcUrl: publicRuntimeConfig.MAGIC_RPC || publicRuntimeConfig.WEB3_PROVIDER,
    chainId: publicRuntimeConfig.CHAIN_ID,
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

const networks: Record<string, any> = {
  polygon: {
    chainId: "0x89",
    chainName: "Polygon",
    nativeCurrency: {
        name: 'Polygon',
        symbol: 'MATIC',
        decimals: 18,
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
  },
  mumbai: {
    chainId: "80001",
    chainName: "Mumbai",
    nativeCurrency: {
        name: 'Mumbai',
        symbol: 'MATIC',
        decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/v1"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com"],
  },
};

export const addNetwork = async (provider: ValistProvider, network: string) => {
  try {
    await provider.send("wallet_addEthereumChain", [networks[network]]);
  } catch (err) {
    console.log(err);
  }
};