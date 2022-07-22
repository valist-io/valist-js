import { useState, useEffect } from 'react';
import { providers, utils } from 'ethers';
import LRU from 'lru-cache';

const provider = new providers.JsonRpcProvider('https://rpc.valist.io/ens');
const cache = new LRU<string, string>({ max: 500 });

export async function resolveName(name: string) {
  const key = name.toLowerCase();
  if (cache.has(key)) {
    return cache.get(key);
  }

  const address = await provider.resolveName(name);
  if (address) {
    cache.set(key, address);
    cache.set(address.toLowerCase(), name);
  }

  return address;
}

export async function resolveAddress(address: string) {
  const key = address.toLowerCase();
  if (cache.has(address)) {
    return cache.get(address);
  }

  const name = await provider.lookupAddress(address);
  if (name) {
    cache.set(key, name);
    cache.set(name.toLowerCase(), address);
  }

  return name;
}

export function useEnsAddress(name: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string | undefined | null>();

  useEffect(() => {
    setIsLoading(false);
    setData(undefined);

    if (!name.endsWith('.eth')) return;

    setIsLoading(true);
    const _name = name;

    resolveName(name).then(address => {
      if (_name === name) setData(address);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [name]);

  return { data, isLoading };
}

export function useEnsName(address: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<string | undefined | null>();

  useEffect(() => {
    setIsLoading(false);
    setData(undefined);
    
    if (!utils.isAddress(address)) return;

    setIsLoading(true);
    const _address = address;

    resolveAddress(address).then(name => {
      if (_address === address) setData(name);
    }).finally(() => {
      setIsLoading(false);
    });
  }, [address]);

  return { data, isLoading };
}
