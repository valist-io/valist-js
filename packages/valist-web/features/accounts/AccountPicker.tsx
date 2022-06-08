import { Select } from '@mantine/core';
import { useColorScheme } from '@mantine/hooks';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAddress, setCurrentAccount } from './accountsSlice';

interface AccountPickerProps {
  accountNames: string[];
  initialValue: string;
}

export default function AccountPicker(props: AccountPickerProps) {
  const address = useAppSelector(selectAddress);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();

  const handleAccountChange = (name: string) => {
    const accountsString = localStorage.getItem('currentAccount');
    let accountByAddress: Record<string, string> = {};

    if (accountsString) {
      accountByAddress = JSON.parse(accountsString);
    }

    accountByAddress[address] = name;
    localStorage.setItem('currentAccount', JSON.stringify(accountByAddress));
    dispatch(setCurrentAccount(name));
  };

  return (
    <Select
      data={props.accountNames}
      onChange={(value) => handleAccountChange(value || "")}
      defaultValue={props.initialValue}
      style={{ width:120, borderRadius: '8px', border: `1px solid ${colorScheme === 'dark' ? 'white' : '' }` }} 
      radius="md"
      size="md"
    />
  );
};