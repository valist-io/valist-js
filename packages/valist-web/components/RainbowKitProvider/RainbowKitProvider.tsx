import { 
  RainbowKitProvider as Provider,
  lightTheme,
  darkTheme,
} from '@rainbow-me/rainbowkit';

import { chains } from '@/components/WagmiProvider';

export interface RainbowKitProviderProps {
  children?: React.ReactNode;
  colorScheme?: 'dark' | 'light';
}

export function RainbowKitProvider(props: RainbowKitProviderProps) {
  const theme = props.colorScheme === 'dark' 
    ? darkTheme() 
    : lightTheme();
	
  return (
    <Provider chains={chains} theme={theme}>
      {props.children}
    </Provider>
  );
}
