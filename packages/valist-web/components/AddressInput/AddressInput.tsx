import { AddressInput as AddressInputUI } from '@valist/ui';
import { ethers } from 'ethers';
import { useEnsAddress } from 'wagmi';
import { useState, useEffect } from 'react';

export interface AddressProps {
  onSubmit: (address: string) => void;
  disabled?: boolean;
}

const isENS = (address: string) => address.endsWith('.eth');
const isAddress = (address: string) => ethers.utils.isAddress(address);

export function AddressInput(props: AddressProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  const { data, isLoading } = useEnsAddress({
    name: value,
    chainId: 1,
    enabled: isENS(value),
  });

  const isValidENS = !isLoading && !!data;
  const isValid = isValidENS || isAddress(value);

  useEffect(() => {
    if (isLoading || isValid || !value) {
      setError('');
    } else if (isENS(value)) {
      setError('Cannot resolve ENS name');
    } else {
      setError('Address format is invalid');
    }
  }, [value, isLoading, isValid]);

  const submit = (event) => {
    event.preventDefault();
    if (isLoading || !isValid) return;

    props.onSubmit(data ?? value);
    setValue('');
  };

  return (
    <form onSubmit={submit}>
      <AddressInputUI
        value={value} 
        error={error}
        disabled={props.disabled}
        loading={isLoading}
        valid={isValid}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
    </form>
  );
}