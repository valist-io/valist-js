import { ethers } from "ethers";
import { Client } from '@valist/sdk';
import getConfig from "next/config";

const { publicRuntimeConfig } = getConfig();

declare global {
  interface Window {
    valist?: Client;
  }
}

export const defaultProvider = new ethers.providers.JsonRpcProvider(publicRuntimeConfig.WEB3_PROVIDER);