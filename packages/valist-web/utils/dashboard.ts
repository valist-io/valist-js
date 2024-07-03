import { useAccount } from 'wagmi';
import { useQuery } from '@apollo/client';
import accountsQuery from '@/graphql/DashboardAccounts.graphql';
import projectsQuery from '@/graphql/DashboardProjects.graphql';
import membersQuery from '@/graphql/DashboardMembers.graphql';
import query from '@/graphql/Dashboard.graphql';

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
  _accounts.filter((a: any) => !accountName || a.name === accountName)
    .flatMap((a: any) => a.projects)
    .forEach((p: any) => projectSet.add(p.id));

  // ignore projects when filtering by account
  if (!accountName) {
    _projects.forEach((p: any) => projectSet.add(p.id));
  }

  const accountIds = Array.from(accountSet.values());
  const projectIds = Array.from(projectSet.values());

  return { accountIds, projectIds, loading };
}

// returns a set of all user accounts & projects
export function useEntities(accountName: string = '') {
  const { accountIds, projectIds, loading } = useEntityIds(accountName);

  const accountsData = useQuery(accountsQuery, {
    variables: { ids: accountIds },
  });

  const projectsData = useQuery(projectsQuery, {
    variables: { ids: projectIds },
  });

  const accounts = accountsData.data?.accounts ?? [];
  const projects = projectsData.data?.projects ?? [];
  const _loading = loading || accountsData.loading || projectsData.loading;

  return { accounts, projects, loading: _loading };
}

// returns formatted dashboard data
export function useDashboard(accountName: string = '') {
  const { accounts, projects, loading } = useEntities(accountName);

  const logMap = new Map<string, any>();
  const memberSet = new Set<string>();

  accounts.filter((a: any) => !accountName || a.name === accountName)
    .flatMap((a: any) => a.logs)
    .forEach((l: any) => logMap.set(l.id, l));

  accounts.filter((a: any) => !accountName || a.name === accountName)
    .flatMap((a: any) => a.members)
    .forEach((m: any) => memberSet.add(m.id));

  projects.flatMap((p: any) => p.logs)
    .forEach((l: any) => logMap.set(l.id, l));

  projects.flatMap((p: any) => p.members)
    .forEach((m: any) => memberSet.add(m.id));

  const members = Array.from(memberSet.values());

  // sort final logs list by blockTime
  const logs = Array.from(logMap.values()).sort(
    (a: any, b: any) => b.blockTime.localeCompare(a.blockTime),
  );

  return { accounts, projects, logs, members, loading };
}

// returns formatted members data
export function useMembers(accountName: string = '') {
  const { accounts, projects, loading } = useEntities(accountName);

  const memberSet = new Set<string>();

  accounts.filter((a: any) => !accountName || a.name === accountName)
    .flatMap((a: any) => a.members)
    .forEach((m: any) => memberSet.add(m.id));

  projects.flatMap((p: any) => p.members)
    .forEach((m: any) => memberSet.add(m.id));

  const memberIds = Array.from(memberSet.values());

  const membersData = useQuery(membersQuery, {
    variables: { ids: memberIds },
  });

  const members = membersData.data?.users ?? [];
  const _loading = loading || membersData.loading;

  return { members, accounts, loading: _loading };
}

export function useAccounts() {
  const { address, isReconnecting } = useAccount();

  const { data, loading } = useQuery(query, {
    variables: { address: address?.toLowerCase() ?? '' },
  });

  const _accounts = data?.user?.accounts ?? [];
  const _projects = data?.user?.projects ?? [];

  const accountMap = new Map<string, any>();

  _accounts.forEach((a: any) => accountMap.set(a.id, a));

  _projects.map((p: any) => p.account)
    .forEach((a: any) => accountMap.set(a.id, a));

  const accounts = Array.from(accountMap.values());

  return { accounts, loading: (loading || isReconnecting) };
}