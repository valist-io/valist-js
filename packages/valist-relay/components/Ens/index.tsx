import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

interface EnsResolverProps {
  address: any,
}

const EnsResolver = (props:EnsResolverProps) => {
  const [ensName, setEnsName] = useState<string>('');

  useEffect(() => {
    (async () => {
      const provider = new ethers.providers.JsonRpcProvider('https://rpc.valist.io/mainnet');
      try {
        const name = await provider.lookupAddress(props.address);
        if (name !== null) {
          setEnsName(name);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div>
      {ensName || props.address}
    </div>
  );
};

export default EnsResolver;
