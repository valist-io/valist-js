import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import useSWRImmutable from 'swr/immutable';
import { useAccount } from 'wagmi';
import { NextRouter, useRouter } from 'next/router';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
import query from '@/graphql/UpdateProjectPage.graphql';

import {
  Button,
  Breadcrumbs,
  _404,
} from '@valist/ui';
import getConfig from 'next/config';
import { DeployForm, useGithubAuth } from '@/components/DeployForm';
import { ProjectMeta } from '@valist/sdk';
import { linkRepo } from '@/forms/link-repo';

function mkurl(CLIENT_ID: string, router: NextRouter) {
  const obj = { pathname: router?.pathname, query: router?.query };
  const state = Buffer.from(JSON.stringify(obj)).toString("base64");
  return `https://github.com/login/oauth/authorize?scope=repo%2Cworkflow&client_id=${CLIENT_ID}&state=${state}`;
}

const Deployments: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const { address } = useAccount();
  const chainId = getChainId();
  const valist = useValist();
  const { publicRuntimeConfig } = getConfig();
  const { CLIENT_ID } = publicRuntimeConfig;
  const code = `${router.query.code || ''}`;

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data, loading:gqLoading } = useQuery(query, { variables: { projectId } });
  const { data: meta } = useSWRImmutable<ProjectMeta>(data?.project?.metaURI);

  const [loading, setLoading] = useState(true);

  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [client, error, isLoading] = useGithubAuth(code);
  const [repo, setRepo] = useState<string>('');

  const gitProviders = [
    {
        name: 'Github',
        icon: '/images/github.svg',
        auth: mkurl(CLIENT_ID, router),
    },
  ];

  const _linkRepo = () => {
    if (!meta) return;
    setLoading(true);
    linkRepo(address,
      projectId,
      meta,
      repo,
      valist,
      cache,
      chainId,
      ).finally(() => {
        setLoading(false);  
      });
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Deployments', href: `/-/account/${accountName}/project/${projectName}/deployments` },
  ];

  // wait for metadata to load
  useEffect(() => {
    if (meta && meta.repository) {
      setRepo(meta.repository);
      setIsLinked(true);
    }
  }, [meta]);

  // redirect to get auth code automatically if repo is linked
  useEffect(() => {
    console.log('------------');
    console.log('isLinked', isLinked);
    console.log('!isLoading', !isLoading);
    console.log('client', client);
    console.log('!code', !code);
    console.log('gitProviders', gitProviders);
    console.log('------------');

    if (!isLoading && !client && !code && CLIENT_ID && router.isReady) {
      console.log('Starting redirect...');
      window.location.assign(mkurl(CLIENT_ID, router));
    }
  }, [client, isLinked, isLoading, router.isReady]);

  if (!gqLoading && !data?.project) {
    return (
      <Layout>
        <_404 
          message={"The project you are looking for doesn't seem to exist, no biggie, click on the button below to create it!"}
          action={
            <Button onClick={() => router.push(`/-/account/${accountName}/create/project`)}>Create project</Button>
          }
        />
      </Layout>
    );
  };

  return (
    <Layout>
      <div style={{ paddingBottom: 32 }}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {isLoading && 
        <div style={{ fontSize: 20 }}>Detecting user auth...</div>
      }
      {client && !isLoading && 
        <DeployForm
          client={client}
          account={accountName}
          project={projectName}
          isLinked={isLinked}
          repoPath={repo}
          gitProviders={gitProviders}
          onRepoSelect={((repo) => {
            setRepo(repo);
          })}
          onPullRequest={() => {
            _linkRepo();
          }}          
        />
      }
    </Layout>
  );
};

export default Deployments;