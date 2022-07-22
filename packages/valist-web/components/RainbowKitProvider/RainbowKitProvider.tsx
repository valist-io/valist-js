import { 
  RainbowKitProvider as Provider,
  connectorsForWallets, 
  wallet,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';

import { chain, createClient, WagmiConfig, configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { magic } from './magic';

const valistProvider = jsonRpcProvider({
  rpc: (chain) => {
    if (chain.id === 137) {
      return { http: 'https://rpc.valist.io' };
    } else if (chain.id === 80001) {
      return { http: 'https://rpc.valist.io/mumbai' };
    } else if (chain.id === 1337) {
      return { http: 'http://localhost:8584' };
    }
    return null;
  },
});

const { chains, provider } = configureChains(
  [chain.polygon, chain.polygonMumbai], 
  [valistProvider],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.metaMask({ chains }),
      wallet.walletConnect({ chains }),
      magic({ chains }),
    ],
  },
  {
    groupName: 'Mobile',
    wallets: [
      wallet.rainbow({ chains }),
      wallet.walletConnect({ chains }),
    ],
  },
]);

const wagmiClient = createClient({ 
  autoConnect: true, 
  connectors, 
  provider,
});

export interface RainbowKitProviderProps {
  children?: React.ReactNode;
  colorScheme?: 'dark' | 'light';
}

export function RainbowKitProvider(props: RainbowKitProviderProps) {
  const theme = props.colorScheme === 'dark' 
    ? darkTheme() 
    : lightTheme();
	
  return (
    <WagmiConfig client={wagmiClient}>
      <Provider chains={chains} theme={theme}>
        {props.children}
      </Provider>
    </WagmiConfig>
  );
}
