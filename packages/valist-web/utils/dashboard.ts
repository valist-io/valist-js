import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import query from '@/graphql/Dashboard.graphql';
import accountsQuery from '@/graphql/DashboardAccounts.graphql';
import projectsQuery from '@/graphql/DashboardProjects.graphql';

// returns a set of all user account & project ids
export function useEntityIds(accountName: string = '') {
  const { address } = useAccount();

  const { data, loading } = useQuery(query, { 
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const _accounts = data?.user?.accounts ?? [];
  const _projects = data?.user?.projects ?? [];

  const accountSet = new Set<string>();
  const projectSet = new Set<string>();

  _accounts.forEach((a: any) => accountSet.add(a.id));
  _accounts.filter((a: any) => !accountName ||  a.name === accountName)
    .flatMap((a: any) => a.projects)
    .forEach((p: any) => projectSet.add(p.id));

  // skip projects when filtering by account
  if (!accountName) _projects.forEach((p: any) => projectSet.add(p.id));

  const accountIds = Array.from(accountSet.values());
  const projectIds = Array.from(projectSet.values());

  return { accountIds, projectIds, loading };
}

// returns all user accounts & projects
export function useDashboard(accountName: string = '') {
  const { accountIds, projectIds } = useEntityIds(accountName);

  const accountsData = useQuery(accountsQuery, {
    variables: { ids: accountIds },
  });

  const projectsData = useQuery(projectsQuery, {
    variables: { ids: projectIds }, 
  });

  const accounts = accountsData.data?.accounts ?? [];
  const projects = projectsData.data?.projects ?? [];
  const loading = accountsData.loading || projectsData.loading;

  const logMap = new Map<string, any>();
  const memberSet = new Set<string>();

  accounts.flatMap((a: any) => a.logs)
    .forEach((l: any) => logMap.set(l.id, l));
  projects.flatMap((p: any) => p.logs)
    .forEach((l: any) => logMap.set(l.id, l));

  accounts.flatMap((a: any) => a.members)
    .forEach((m: any) => memberSet.add(m.id));
  projects.flatMap((p: any) => p.members)
    .forEach((m: any) => memberSet.add(m.id));

  const members = Array.from(memberSet.values());

  // sort final logs list by blockTime
  const logs = Array.from(logMap.values()).sort(
    (a: any, b: any) => b.blockTime.localeCompare(a.blockTime),
  );

  return { accounts, projects, logs, members, loading };
}