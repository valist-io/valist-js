import { AsyncInput } from '@valist/ui';
import { useState, useEffect, useContext } from 'react';
import { ValistContext } from '@/components/ValistProvider';

export interface NameInputProps {
  parentId: string | number;
  disabled?: boolean;
  value?: string;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export function NameInput(props: NameInputProps) {
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [error, setError] = useState<string>();
  const valist = useContext(ValistContext);

  useEffect(() => {
    setLoading(false);
    setExists(false);
    setError(undefined);

    if (!props.value) return;
    setLoading(true);

    const id = valist.generateID(props.parentId, props.value);
    const value = props.value;

    const timeout = setTimeout(() => {
      // this uses the same contract method for accounts, projects, and releases
      valist.accountExists(id).catch((err: any) => {
        setError(err.message);
      }).then(_exists => {
        if (value === props.value) setExists(!!_exists);
      }).finally(() => {
        if (value === props.value) setLoading(false);
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [props.value, props.parentId, valist]);

  useEffect(() => {
    if (exists) {
      setError('Name has been taken');
    }
  }, [exists]);

  const isValid = !!props.value && !exists && !loading;

	return (
    <AsyncInput
      value={props.value} 
      error={error ?? props.error}
      disabled={props.disabled}
      loading={loading}
      label={props.label}
      placeholder={props.placeholder}
      required={props.required}
      valid={isValid}
      onChange={props.onChange}
    />
  );
}
