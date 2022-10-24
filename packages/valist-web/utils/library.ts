import { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { SapphireContext } from '@/components/SapphireProvider';
import releaseQuery from '@/graphql/LibraryReleases.graphql';
import query from '@/graphql/Library.graphql';

export function useInstalls() {
  const sapphire = useContext(SapphireContext);

  const [downloads, setDownloads] = useState<string[]>([]);
  const [installed, setInstalled] = useState<string[]>([]);

  useEffect(() => {
    sapphire.listInstalled().then(setInstalled);
    sapphire.listDownloads().then(setDownloads);

    const installStarted = (id: string) => {
      setDownloads([...downloads, id]);
    };

    const installSuccess = (id: string) => {
      setDownloads(downloads.filter(d => d !== id));
      setInstalled([...installed, id]);
    };

    const installFailed = (id: string) => {
      setDownloads(downloads.filter(d => d !== id));
    };

    const uninstallSuccess = (id: string) => {
      setInstalled(installed.filter(i => i !== id));
    };

    sapphire.on('installStarted', installStarted);
    sapphire.on('installSuccess', installSuccess);
    sapphire.on('installFailed', installFailed);
    sapphire.on('uninstallSuccess', uninstallSuccess);

    return () => {
      sapphire.removeListener('installStarted', installStarted);
      sapphire.removeListener('installSuccess', installSuccess);
      sapphire.removeListener('installFailed', installFailed);
      sapphire.removeListener('uninstallSuccess', uninstallSuccess);
    };
  }, []);

  const { data, loading } = useQuery(releaseQuery, {
    variables: { ids: installed },
  });

  const _releases = data?.releases ?? [];

  return { loading, downloads, releases: _releases };
}

export function useLibrary() {
  const { address } = useAccount();

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const _licenses = data?.user?.licenses ?? [];
  const _projects = _licenses.map((l: any) => l.project);

  return { loading, projects: _projects };
}
