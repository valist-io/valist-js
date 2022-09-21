import { connectorsForWallets, wallet, Wallet } from '@rainbow-me/rainbowkit';
import { MagicConnector } from '@everipedia/wagmi-magic-connector';
import { Chain } from 'wagmi';

export const magic = ({ chains }: any): Wallet => ({
  id: 'magic',
  name: 'Email',
  iconUrl: 'images/magic.svg',
  iconBackground: '#ffffff',
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

export const connectors = (chains: Chain[]) => connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      magic({ chains }),
      wallet.rainbow({ chains }),
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains }),
    ],
  },
]);
