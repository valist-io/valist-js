import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface EnsResolverProps {
  address: string,
}

const EnsResolver = (props:EnsResolverProps) => {
  const [ensName, setEnsName] = useState<string>('');

  useEffect(() => {
    (async () => {
      if (props?.address?.length > 4) {
        const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com');
        try {
          const name = await provider.lookupAddress(props.address);
          if (name !== null) {
            setEnsName(name);
          }
        } catch (err) {
          console.log(err);
        }
      }
    })();
  }, [props.address]);

  return (ensName || null);
};

export default EnsResolver;
