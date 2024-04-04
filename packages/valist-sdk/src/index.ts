/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { BigNumberish, JsonRpcProvider, ethers } from 'ethers';
import Client from './client';
import * as contracts from './contracts';
import * as graphql from './graphql';
import axios, { AxiosProgressEvent, AxiosRequestConfig } from 'axios';
import https from "https";
import http from "http";
import { formatBytes } from './utils';

export type Provider = ethers.Signer | ethers.Provider;

export interface Options {
  chainId: BigNumberish;
  ipfsHost: string;
  ipfsGateway: string;
  metaTx: boolean;
  wallet: ethers.Wallet;
  registryAddress: string;
  licenseAddress: string;
  subgraphUrl: string;
}

export type IPFSOptions = {
  apiSecret?: string;
  wrapWithDirectory?: boolean;
  cidVersion?: number;
  progress?: (percentCompleteOrBytesUploaded: number | string) => void;
}

export type IPFSCLIENT = {
  add: (value: any, options: IPFSOptions) => Promise<string | undefined>;
  addAll: (values: any, options: any) => Promise<string[]>;
  addAllNode?: (values: any[], addOptions: IPFSOptions) => Promise<{ Hash: string, Name: string, Size: number }[]>;
}

export const isBrowser = typeof window !== 'undefined';

export const createIPFS = (_value: Record<string, unknown>): IPFSCLIENT => {
  const API = 'https://pin-1.valist.io/api/v0';

  const addAll = async (values: any[], options: IPFSOptions) => {
    const FormData = isBrowser ? window.FormData : require('form-data');

    const data: { Name: string, Hash: string }[] = [];
    let path = `${API}/add?progress=true`;

    if (options?.cidVersion == 0 || options?.cidVersion == 1)
      path += `&cid-version=${options.cidVersion}`;

    if (options?.wrapWithDirectory)
      path += '&wrap-with-directory=true';

    const formData = new FormData();
    for (const item of values) {
      const content = item?.content || item;
      const path = item?.path;

      if (content instanceof Blob) {
        path === "meta.json"
      }

      if (isBrowser) {
        formData.append('file', content, path);
      } else {
        formData.append('file', content, {
          filepath: path,
          contentType: 'application/octet-stream',
        });
      }
    }

    const reqConfig: AxiosRequestConfig = {
      onUploadProgress: (progressEvent: AxiosProgressEvent) => {
        if (options?.progress) {
          options.progress(progressEvent.total ? `${((progressEvent.loaded * 100) / progressEvent.total).toFixed(2)}%` : formatBytes(progressEvent.loaded.toString()));
        }
      },
    };

    // workaround for node.js since ipfs pinning behind secure proxy doesn't support duplex connections
    if (typeof window !== undefined) {
      reqConfig.httpsAgent = new https.Agent({ keepAlive: false });
    }

    const res = await axios.postForm(path, formData, reqConfig);

    if (res.status === 400)
      return [];

    if (res.data) {
      const jsonLines = (res.data as string).split('\n');
      jsonLines.forEach((line) => {
        if (line) {
          const jsonValue = JSON.parse(line);
          data.push(jsonValue);
        }
      });
    }

    const hashes: string[] = [];
    data.forEach(item =>
      item?.Hash && hashes.push(item.Hash)
    );

    return hashes;
  }

  const add = async (value: any, options: any) => {
    const data = await addAll([value], options);
    if (data.length !== 0)
      return data[data.length - 1];
  }

  const ipfsClient: IPFSCLIENT = {
    addAll,
    add,
  };

  if (!isBrowser) {
    const addAllNode = async (values: any[], addOptions: IPFSOptions) => {
      const FormData = require('form-data');
      const formData = new FormData(); // @ts-expect-error sdcd
      const fetch = (...args: any) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

      for (const { path, content } of values) {
        formData.append('file', content, {
          filepath: path,
          contentType: 'application/octet-stream',
        });
      }

      const url = new URL(`${API}/add`);
      url.search = new URLSearchParams({
        'chunker': 'rabin-131072-262144-524288',
        'cid-version': `${addOptions.cidVersion || 0}`,
        ...addOptions.wrapWithDirectory && { 'wrap-with-directory': 'true' }
      }).toString();

      const agent = url.protocol === 'https:' ? new https.Agent({ keepAlive: false }) : new http.Agent({ keepAlive: false });

      try {
        const response = await fetch(url.toString(), {
          method: 'POST',
          body: formData,
          agent,
        });


        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();
        const lines = text.split('\n').filter((line: string) => line.trim());
        const data = lines.map((line: string) => JSON.parse(line)).filter((item: null) => item !== null);
        return data;
      } catch (error) {
        console.error('Upload failed:', error);
        return [];
      }
    };

    ipfsClient.addAllNode = addAllNode;
  }

  return ipfsClient;
};

/**
 * Create a read-only Valist client using the given JSON RPC provider.
 * 
 * @param provider Provider to use for transactions
 * @param options Additional client options
 */
export function createReadOnly(provider: JsonRpcProvider, options: Partial<Options>): Client {
  const chainId = options.chainId || 137;

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(Number(chainId));
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(Number(chainId));
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(Number(chainId));

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, provider);

  const ipfs = createIPFS({ url: options.ipfsHost || 'https://pin-1.valist.io/api/v0' });
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, undefined, false);
}

/**
 * Create a Valist client using the given JSON RPC provider.
 * 
 * @param providerOrSigner Provider or signer to use for transactions
 * @param options Additional client options
 */
export async function create(providerOrSigner: Provider, options: Partial<Options>): Promise<Client> {
  let signer: ethers.Signer | null;
  let provider: ethers.Provider | null;

  // coerce the signer and provider out of the merged types
  if (providerOrSigner?.provider) {
    signer = providerOrSigner as ethers.Signer;
    provider = signer.provider;
  } else {
    provider = providerOrSigner as ethers.BrowserProvider;
    signer = await (provider as ethers.BrowserProvider).getSigner();
  }

  if (!provider) {
    throw new Error('invalid provider');
  }

  if (!options.chainId) {
    const network = await provider.getNetwork();
    options.chainId = network.chainId;
  }

  const subgraphUrl = options.subgraphUrl || graphql.getSubgraphUrl(Number(options.chainId) || 137);
  const registryAddress = options.registryAddress || contracts.getRegistryAddress(Number(options.chainId) || 137);
  const licenseAddress = options.licenseAddress || contracts.getLicenseAddress(Number(options.chainId) || 137);

  const registry = new ethers.Contract(registryAddress, contracts.registryABI, provider);
  const license = new ethers.Contract(licenseAddress, contracts.licenseABI, signer);

  const ipfsConfig: any = {
    url: options.ipfsHost || 'https://pin-1.valist.io/api/v0',
  };

  // if in Node.js environment, disable connection keepAlive due to:
  // https://github.com/ipfs/kubo/issues/6402
  // https://github.com/ipfs/go-ipfs-cmds/pull/116
  // https://github.com/ipfs/kubo/issues/5168#issuecomment-402806747
  if (typeof window === 'undefined') {
    ipfsConfig.agent = require('https').Agent({ keepAlive: false });
  }

  const ipfs = createIPFS(ipfsConfig);
  const ipfsGateway = options.ipfsGateway || 'https://gateway.valist.io';

  return new Client(registry, license, ipfs, ipfsGateway, subgraphUrl, signer, options.metaTx);
}

export * from './types';
export * from './utils';

export { Client, contracts, graphql };
