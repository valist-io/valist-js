import { useState, useEffect, useContext } from 'react';
import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import { SapphireContext } from '@/components/SapphireProvider';
import releaseQuery from '@/graphql/LibraryReleases.graphql';
import query from '@/graphql/Library.graphql';

export function useInstalls() {
  const sapphire = useContext(SapphireContext);
  const [releaseIds, setReleaseIds] = useState<string[]>([]);

  useEffect(() => {
    sapphire.listInstalled().then(setReleaseIds);
  }, []);

  const { data, loading } = useQuery(releaseQuery, {
    variables: { ids: releaseIds },
  });

  const _releases = data?.releases ?? [];

  return { loading, releases: _releases };
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
