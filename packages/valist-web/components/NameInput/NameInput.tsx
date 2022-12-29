import {
  Code, 
  Group,
  Text,
  TextInput,
  Stack,
} from '@mantine/core';

import * as Icon from 'tabler-icons-react';
import { AsyncInput } from '@valist/ui';
import { useState, useEffect } from 'react';
import { useValist } from '@/utils/valist';
import { shortnameFilterRegex, versionFilterRegex } from '@/forms/common';

const sanitize = (raw: string, isRelease?: boolean) => raw
  .replaceAll(isRelease ? versionFilterRegex : shortnameFilterRegex, '') // remove invalid characters
  .replaceAll(/\s+/g, '-')      // replace whitespace with -
  .replace(/^-+/, '')           // remove - at start
  .replace(/-+$/, '')           // remove - at end
  .toLowerCase();               // lowercase everything

export interface NameInputProps {
  parentId: string | number;
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSanitize?: (value: string) => void;
  message: string;
  isRelease?: boolean;
}

export function NameInput(props: NameInputProps) {
  const valist = useValist();

  const [sanitized, setSanitized] = useState('');
  const [loading, setLoading] = useState(false);
  const [exists, setExists] = useState(false);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    setLoading(false);
    setExists(false);
    setError(undefined);

    if (!sanitized) return;
    setLoading(true);

    const id = valist.generateID(props.parentId, sanitized);
    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      // this uses the same contract method for accounts, projects, and releases
      valist.accountExists(id).catch((err: any) => {
        if (!controller.signal.aborted) setError(err.message);
      }).then(_exists => {
        if (!controller.signal.aborted) setExists(!!_exists);
      }).finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    }, 1000);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [sanitized, props.parentId, valist]);

  useEffect(() => {
    if (exists) setError('Name has been taken');
  }, [exists]);

  useEffect(() => {
    setValid(!!sanitized && !exists && !loading);
  }, [sanitized, exists, loading]);

  useEffect(() => {
    props.onSanitize?.(valid ? sanitized : '');
  }, [valid, sanitized]);

  useEffect(() => {
    setSanitized(sanitize(props.value ?? '', props.isRelease));
  }, [props.value]);

	return (
    <Stack>
      {sanitized &&
        <Group spacing={4}>
          <Icon.AlertTriangle color="orange" size={20} />
          {props.message}
          <Code style={{ fontSize: 15 }}>{sanitized}</Code>
        </Group>
      }
      <AsyncInput
        value={props.value}
        error={error ?? props.error}
        disabled={props.disabled}
        loading={loading}
        label={props.label}
        placeholder={props.placeholder}
        required={props.required}
        valid={valid}
        onChange={props.onChange}
      />
    </Stack>
  );
}
