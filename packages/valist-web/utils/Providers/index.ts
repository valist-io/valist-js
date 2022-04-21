import WalletConnectProvider from '@walletconnect/web3-provider';
import { Web3Provider } from "@ethersproject/providers";
import { MetaMaskInpageProvider } from "@metamask/providers";
import { ethers } from "ethers";
import { Magic } from "magic-sdk";
import { SetUseState, ValistProvider } from '../Account/types';
import { Client } from '@valist/sdk';
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
    valist?: Client;
  }
}

export const newMagic = () => {
  const customNodeOptions = {
    rpcUrl: 'https://polygon-rpc.com',
    chainId: 137,
  };

  return new Magic('pk_live_631BA2340BB9ACD8', { network: customNodeOptions });
};

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);

export const addressFromProvider = async (provider: Web3Provider) => {
  const signer = provider.getSigner();
  const account = await signer.getAddress();
  return account;
};

export const providers:Record<any, any> = {
  walletConnect: async () => {
    const wc = new WalletConnectProvider({
      rpc: {
        137: 'https://rpc.valist.io/polygon',
        80001: 'https://rpc.valist.io/polygon',
      },
    });
    await wc.enable();    //  Enable session (triggers QR Code modal)
    return wc;
  },
  metaMask: async () => {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    } catch(err) {
      console.log("Could not connect to MetaMask", err);
    }
      
    return window.ethereum;
  },
  magic: async (params: {email: string, setMagic: SetUseState<Magic | null>}) => {
    const { email } = params;
    const magic = newMagic();

    try {
      const magicLoggedIn = await magic.user.isLoggedIn();
      if (!magicLoggedIn) {
        await magic.auth.loginWithMagicLink({ email });
      }
    } catch(err){
      console.log(err);
    }

    params.setMagic(magic);
    return magic.rpcProvider;
  },
  readOnly: async () => {
    return "https://rpc.valist.io/polygon"
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