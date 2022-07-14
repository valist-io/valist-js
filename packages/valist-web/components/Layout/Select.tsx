import { useContext } from 'react';
import { AccountSelect } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import { AccountContext } from '@/components/AccountProvider';

export function Select() {
  const { account, accounts, setAccount, accountMeta } = useContext(AccountContext);

  const projectCount = (length: number) => (
    `${length} project${length !== 1 ? 's' : ''}`
  );

  const changeAccount = (name: string) => {
    setAccount(accounts.find(acc => acc.name === name));
  };

  if (!account) return undefined;

	return (
    <AccountSelect
      value={account.name}
      image={accountMeta?.image}
      href="/-/create/account"
      onChange={changeAccount}
    >
      {accounts.map((acc, index) => 
        <Metadata key={index} url={acc.metaURI}>
          {(data: any) => (
            <AccountSelect.Option
              name={acc.name}
              label={projectCount(acc.projects.length)}
              image={data?.image}
            />
          )}
        </Metadata>
      )}
    </AccountSelect>
  );
}