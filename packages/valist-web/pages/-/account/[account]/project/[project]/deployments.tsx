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
  Breadcrumbs,
  _404,
  CheckboxList,
} from '@valist/ui';
import getConfig from 'next/config';
import { DeployForm, useGithubAuth } from '@/components/DeployForm';
import { ProjectMeta } from '@valist/sdk';
import { linkRepo } from '@/forms/link-repo';
import { Anchor, Button, Center, Loader, Modal, Text } from '@mantine/core';

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
  const [privateKey, setPrivateKey] = useState<string>('');
  const [publicKey, setPublicKey] = useState<string>('');
  const [isLinked, setIsLinked] = useState<boolean>(false);
  const [client, error, isLoading] = useGithubAuth(code);
  const [repoPath, setRepoPath] = useState<string>('');

  const [showStatus, setShowStatus] = useState<boolean>(false);
  const [statusStep, setStatusStep] = useState<number>(1);
  const [renewToken, setRenewToken] = useState<boolean>(false);

  const gitProviders = [
    {
        name: 'Github',
        icon: '/images/github.svg',
        auth: mkurl(CLIENT_ID, router),
    },
  ];

  const _linkRepo = async (valistConfig: string) => {
    if (!meta || !client) return;
    setLoading(true);
    await linkRepo(
      address,
      projectId,
      meta,
      repoPath,
      publicKey,
      privateKey,
      valistConfig,
      valist,
      client,
      cache,
      chainId,
      setShowStatus,
      setStatusStep,
    );
    setLoading(false);  
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Deployments', href: `/-/account/${accountName}/project/${projectName}/deployments` },
  ];

  const statusList = [
    { label:  `Add Signer Key ${publicKey}`, checked: statusStep >= 2 },
    { label:  `Adding Private Key to GitHub`, checked: statusStep >= 3 },
    { label:  `Creating Pull Request`, checked: statusStep >= 4 },
    { label:  `Link Repo in Project Meta`, checked: statusStep >= 5 },
  ];

  // wait for metadata to load
  useEffect(() => {
    if (meta && meta.repository) {
      setRepoPath(meta.repository);
      setIsLinked(true);
    }
  }, [meta]);

  // redirect to get auth code automatically if repo is linked
  useEffect(() => {
    const expiryTime = Number(sessionStorage.getItem('github-session-expiry'));
    const currentTime = new Date().getTime();
    
    console.log('------------');
    console.log('isLinked', isLinked);
    console.log('!isLoading', !isLoading);
    console.log('CLIENT_ID', CLIENT_ID);
    console.log('client', client);
    console.log('!code', !code);
    console.log('gitProviders', gitProviders);
    console.log('tokenExpiry', expiryTime);
    console.log('currentTime', currentTime);
    console.log('------------');

    const isExpired = expiryTime < currentTime;
    if (isExpired) sessionStorage.clear();

    const expiredState = !isLoading && CLIENT_ID && router.isReady && isExpired && !code;

    if (!isLoading && !client && !code && CLIENT_ID && router.isReady || expiredState) {
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
          gitProviders={gitProviders}
          repoPath={repoPath}
          linkRepo={_linkRepo}
          publicKey={publicKey}
          setPrivateKey={setPrivateKey}
          setPublicKey={setPublicKey}
          renewAuth={setRenewToken}
          onRepoSelect={((repo: string) => {
            setRepoPath(repo);
          })}   
        />
      }
      {showStatus && <Modal 
        centered 
        opened={showStatus} 
        onClose={() => setShowStatus(false)}
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        {statusStep < 5 &&
          <>
            <Center><Text mx='lg'>Connecting Repository</Text></Center>
            <Center><Loader my='lg' color="violet" variant="dots" /></Center>
            <CheckboxList 
              items={statusList} 
            />
          </>
        }
        {statusStep === 5 &&
          <div>
            Successfully created pull request for 
            <Anchor href={`https://github.com/${repoPath}`}>
              https://github.com/{repoPath}
            </Anchor>
            <Button onClick={() => setShowStatus(false)}>Close</Button>
          </div>
        }
      </Modal>}
    </Layout>
  );
};

export default Deployments;