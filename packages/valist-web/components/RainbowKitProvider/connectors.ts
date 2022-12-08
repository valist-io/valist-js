import { connectorsForWallets, wallet, Wallet } from '@rainbow-me/rainbowkit';
import { MagicConnector } from '@everipedia/wagmi-magic-connector';
import { Chain } from 'wagmi';

export const magic = ({ chains }: any): Wallet => ({
  id: 'magic',
  name: 'Email',
  iconUrl: 'images/mail.svg',
  iconBackground: '#1E88E5',
  // @ts-ignore
  createConnector: () => {
    const connector = new MagicConnector({
      chains: chains,
      options: {
        apiKey: 'pk_live_631BA2340BB9ACD8',
        additionalMagicOptions: {
          network: {
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
          },
        },
      },
    });

    return { connector };
  },
});

export const connectors = (chains: Chain[]) => {
  const wallets = [
    magic({ chains }),
    wallet.rainbow({ chains }),
    wallet.walletConnect({ chains }),
  ];

  const isSapphire = typeof window !== 'undefined' 
    && typeof window.sapphire !== 'undefined';

  if (isSapphire) {
    wallets.push(wallet.injected({ chains }));
  } else {
    wallets.push(wallet.metaMask({ chains }));
  }

  return connectorsForWallets([
    { groupName: 'Popular', wallets },
  ]);
};
