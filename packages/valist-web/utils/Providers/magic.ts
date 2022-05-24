import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain, Wallet } from '@rainbow-me/rainbowkit';
import { MagicConnector } from '@everipedia/wagmi-magic-connector';

export const magic = (): Wallet => ({
  id: 'magic',
  name: 'Magic',
  iconUrl: 'images/magic.svg',
  iconBackground: '#ffffff',
  createConnector: () => {
    const connector = new MagicConnector({
      options: {
        apiKey: 'pk_live_631BA2340BB9ACD8',
        oauthOptions : {
          providers: ['github', 'google', 'discord'],
        },
        additionalMagicOptions: {
          network: {
            rpcUrl: 'https://polygon-rpc.com',
            chainId: 137,
          }
        },
      },
    });

    return { connector };
  },
});
