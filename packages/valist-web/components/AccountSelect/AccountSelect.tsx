import { useContext } from 'react';
import { AccountSelect as AccountSelectUI } from '@valist/ui';
import { Metadata } from '@/components/Metadata';
import { AccountContext } from '@/components/AccountProvider';

export function AccountSelect() {
  const { account, accounts, setAccount, accountMeta } = useContext(AccountContext);

  const projectCount = (length: number) => (
    `${length} project${length !== 1 ? 's' : ''}`
  );

	return (
    <AccountSelectUI
      value={account?.name ?? ''}
      image={accountMeta?.image}
      href="/-/create/account"
      onChange={setAccount}
    >
      {accounts.map((acc, index) => 
        <Metadata key={index} url={acc.metaURI}>
          {(data: any) => (
            <AccountSelectUI.Option
              name={acc.name}
              label={projectCount(acc.projects?.length ?? 0)}
              image={data?.image}
            />
          )}
        </Metadata>,
      )}
    </AccountSelectUI>
  );
}