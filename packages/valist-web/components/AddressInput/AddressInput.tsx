import { AsyncInput, Button } from '@valist/ui';
import { ethers } from 'ethers';
import { useState, useEffect, KeyboardEvent } from 'react';
import { useEnsAddress } from 'wagmi';

const isENS = (address: string) => address.endsWith('.eth');
const isAddress = (address: string) => ethers.utils.isAddress(address);

export interface AddressProps {
  value?: string;
  label?: string;
  onSubmit: (address: string) => void;
  required?: boolean;
  disabled?: boolean;
}

export function AddressInput(props: AddressProps) {
  const [value, setValue] = useState(props.value || '');
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

  const submit = (event: React.KeyboardEvent<HTMLElement>, submit?: boolean) => {
    if (event.key !== 'Enter' && !submit) return;
    event.preventDefault();

    if (isLoading || !isValid) return;
    props.onSubmit(data ?? value);
    setValue(value ? (data || value) : '');  
  };

  return (
    <>
      <AsyncInput
        label={props?.label || "Add member"}
        placeholder="Address or ENS"
        value={value} 
        error={error}
        disabled={props.disabled}
        loading={isLoading}
        valid={isValid}
        required={props.required}
        onKeyPress={submit}
        onChange={(event) => setValue(event.currentTarget.value)}
      />
      <Button style={{ width: 150 }} onClick={(e: KeyboardEvent<HTMLElement>) => submit(e, true)}>
        Add
      </Button>
    </>
  );
}