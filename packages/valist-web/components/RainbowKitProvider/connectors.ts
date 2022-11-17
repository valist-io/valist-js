import { connectorsForWallets, wallet, Wallet } from '@rainbow-me/rainbowkit';
import { Chain } from 'wagmi';

export const connectors = (chains: Chain[]) => {
  const wallets = [
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
