import { Avatar, Center, Anchor, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Image } from '@valist/ui';
import { Metadata } from '@/components/Metadata';

interface TopPublishersProps {
  accounts: {name: string, metaURI: string, count: number}[]
}

export function TopPublishers(props: TopPublishersProps): JSX.Element {
  const isMobile = useMediaQuery('(max-width: 900px)');
  
  return (
    <div>
      <h2 style={{ fontStyle: 'normal', fontWeight: 700, fontSize: isMobile ? 18 : 32 }}>Top Publishers</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {props.accounts?.slice(0, 10).map((account: any) => (
          <Metadata key={account.id} url={account?.metaURI}>
            {(data: any) =>
              <Anchor href={`/${account?.name}`}>
                <Center><Avatar size={128} src={data?.image} alt={account?.name} /></Center>
                <Center><Text>{account?.name}</Text></Center>
              </Anchor>
            }
          </Metadata>
        ))}
      </div>
    </div>
  );
};
