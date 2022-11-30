import { addSecret, BuildManifest, buildYaml, checkRepoSecret, createPullRequest, getJobLogs, getRepos, getRepoSecrets, getWorkflows, webFrameworkDefaults } from "@/utils/github";
import { Button as MantineButton, Center, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { Octokit } from "@octokit/core";
import { Stepper } from "@valist/ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddKey } from "./screens/AddKey";
import { LoadingScreen } from "./screens/Loading";
import { SelectRepo } from "./screens/SelectRepo";
import { Workflows } from "./screens/Workflows";
import Image from 'next/image';
import { ConfigureBuilds } from "./screens/ConfigureBuilds";
import { useForm } from "@mantine/form";

export type GitProvider = {
  name: string; 
  icon: string;
  auth: string;
}
interface DeployFormProps {
  client: Octokit | null;
  account: string;
  project: string;
  gitProviders: GitProvider[];
  repoPath?: string;
  isLinked: boolean;
  onConnected?: () => void;
  onRepoSelect?: (repo: string) => void;
  onKeyAdded?: () => void;
  onPullRequest?: () => void;
}

export type Screen = 'index' | 'loading' | 'selectRepo' | 'addKey' | 'pullRequest';

export function DeployForm(props: DeployFormProps): JSX.Element {
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const [logs, setLogs] = useState<string[]>([]);
  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [repoWorkflows, setRepoWorkflows] = useState<any[]>([]);
  const [repoSecrets, setRepoSecrets] = useState<string[]>([]);
  const [repoPath, setRepoPath] = useState<string>('');
  const owner = props?.repoPath?.split('/')[0];
  const repo = props?.repoPath?.split('/')[1];
  const [newSecretName, setNewSecretName] = useState<string>('');
  const [newSecretValue, setNewSecretValue] = useState<string>('');

  const form = useForm({
    initialValues: {
      build: {
        web: {
          environment: 'node16',
          framework: 'next',
          installCommand: 'npm install',
          buildCommand: 'npm run build && npx next export',
          outputFolder: 'out',
        },
      },
      publish: {
        valist: {
          privateKey: '${{ secrets.VALIST_SIGNER }}',
          account: props.account,
          project: props.project,
          release: '${{ env.TIMESTAMP }}',
          path: 'out',
        },
      },
      integrations: {},
    },
  });

  const [valistConfig, setValistConfig] = useState<string>(buildYaml(form.values as BuildManifest));
  const [isSigner, setIsSigner] = useState<boolean>(false);

  const steps = [
    { label: "Step 1", description: "Connect your repo", text: "Step 1: Connect your repository!" },
    { label: "Step 2", description: "Configure your builds", text: "Step 2: Configure your builds" },
    { label: "Step 3", description: "Choose where to publish", text: "Step 3: Choose where you'd like to Publish!" },
    { label: "Step 4", description: "Add integrations", text: "Step 4: Add integrations" },
  ];
  const totalSteps = steps.length;
  const nextStep = step + 1;
  const prevStep = step - 1;
  const next = () => setStep(nextStep <= totalSteps ? nextStep : step);
  const prev = () => setStep(prevStep >= 0 ? prevStep : step);

  const _selectRepo = async (name: string) => {
    const [_owner, _repo] = name.split('/');
    if (!_owner && _repo) return;
    setLoading(true);
    setRepoPath(name);

    if (props.onRepoSelect) props.onRepoSelect(repoPath);
    if (props.client) setIsSigner(await checkRepoSecret(props.client, _owner, _repo));
    setLoading(false);
  };

  const _fetchLogs = async (job_id: number) => {
    if (!props.client || !owner || !repo) return;
    const logs = await getJobLogs(props.client, owner, repo, job_id);

    if (logs?.data?.jobs.length !== 0 && logs?.data?.jobs[0] && logs?.data?.jobs[0].steps) {
      setLogs(logs?.data?.jobs[0].steps.map((step) => {
        return step.name;
      }));
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _pullSecrets = () => {
    if (!props.client || !owner || !repo) return;
    getRepoSecrets(props.client, owner, repo).then((secrets) => {
      setRepoSecrets(secrets.data.secrets.map((secret) => {
        return secret.name;
      }));
    });
  };

  const _addSecret = async () => {
    if (!props.client || !owner || !repo) return;
    await addSecret(props.client, owner, repo, newSecretName, newSecretValue);
    _pullSecrets();
  };

  const _addKey = () => {

  };

  const _createPr = async () => {
    if (!props.client || !owner || !repo) return;
    await createPullRequest(props.client, valistConfig, owner, repo);
    props.onPullRequest ? props.onPullRequest() : null;
  };

  // update valist config
  useEffect(() => {
    const config = buildYaml(
      (form.values as BuildManifest),
    );
    setValistConfig(config);
  } ,[form.values]);

  // request user repositories if no repo set
  useEffect(() => {
    if (props.client && !props.repoPath) {
      getRepos(props.client).then((repos) => {
        const names = repos?.data?.map((repo) => {
          return repo.full_name;
        });

        setUserRepos(names);
        if (names.length !== 0) _selectRepo(names[0]);
      });
    };
  }, [props.client]);

  // logging & debugging
  useEffect(() => {
    console.log('form values', form.values);
  }, [form.values]);

  // request user workflows if repo set
  useEffect(() => {
    if (props.client && owner && repo) {
      console.log('workflow repo', repo);
      getWorkflows(props.client, owner, repo).then((data) => {
        const workflows = data?.data?.workflow_runs;
        if (workflows.length !== 0) setRepoWorkflows(workflows);
      });
    };

    setRepoWorkflows([
      [],
    ]);
  }, [repo]);

  // request user secrets
  useEffect(() => {
     _pullSecrets();
  }, [repo]);

  // if framework changes update defaults
  useEffect(() => {
    // @ts-ignore
    const { installCommand, buildCommand, outputFolder } =  webFrameworkDefaults[form.values.build.web.framework];
    form.setFieldValue("form.values.build.Web.installCommand", installCommand || '');
    form.setFieldValue("form.values.build.Web.buildCommand']", buildCommand || '');
    form.setFieldValue("form.values.build.Web.outputFolder']", outputFolder || '');
  }, [form.values.build.web.framework]);

  const renderScreen = () => {
    if ((props.client && !props.isLinked && userRepos.length === 0) || (props.isLinked && repoWorkflows.length === 0)) return <LoadingScreen />;
    if (props.isLinked && repoWorkflows) {
      return (
        <Workflows
          data={repoWorkflows} 
          logs={[]} 
          fetchLogs={_fetchLogs} 
        />
      );
    }
    if (!props.isLinked && userRepos.length !== 0 && step === 0) {
      return (
        <section>
          <SelectRepo
            value={repoPath}
            repos={userRepos}
            onChange={_selectRepo} 
            onRepoSelect={async () => {}}
          />
          {isSigner &&
            <>
              <Center><Text size="xl">This repository contains a valid signer key.</Text></Center>
              <Center><Text size="lg">You&lsquo;re ready to publish!</Text></Center>
            </>
          }
          {loading && <LoadingScreen />}
          {!isSigner && !loading &&
            <AddKey
              account={props.account} 
              project={props.project} 
              repo={props.repoPath || ''}
            />
          }
        </section>
      );
    }
    if (!props.isLinked && step === 1) {
      return (
        <ConfigureBuilds
          form={form} 
          secrets={repoSecrets} 
        />
      );
    }
    if (!props.isLinked && step === 2) {
      return (
        <section>
          {Object.keys(publishTypes).map((publisher) => (
            <button
              key={publisher}
              style={{ width: 240, margin: 20 }}
            >
              <span><Image style={{ display: 'block' }} height={55} width={55} alt={publisher + 'Logo'} src={publishTypes[publisher].icon} /></span>
              <span style={{ fontSize: 25, display: 'block' }}>{publisher}</span>
            </button>
          ))}
        </section>
      );
    }
    if (!props.isLinked && step === 3) {
      return (
        <section>
          <Center><Text>Add optional integrations to notify your users when you publish a new release</Text></Center>
          {Object.keys(integrations).map((integration) => (
            <button
              key={integration}
              style={{ width: 240, margin: 20 }}
            >
              <span><Image style={{ display: 'block' }} height={55} width={55} alt={integration + 'Logo'} src={integrations[integration].icon} /></span>
              <span style={{ fontSize: 25, display: 'block' }}>{integration}</span>
            </button>
          ))}
        </section>
      );
    }
    if (!props.isLinked && step === 4) {
      return (
        <section>
          <Center>
             <Textarea
              value={valistConfig}
              style={{ width: 750 }}
              disabled
              size="xl"
              minRows={13}
            />
          </Center>
        </section>
      );
    }
  };

  return (
    <Stack style={{ maxWidth: 1200 }}>
      <Title mt="lg">Deployments</Title>
      <Text color="dimmed">Configure automatic deployments, continuous integration, and source control.</Text>
      {!props.isLinked && 
        <Stepper 
          active={step} 
          setActive={() => {}} 
          steps={steps}
          completed={"Congratulations, you're ready to deploy your project! 🥳"}
        />
      }

      {renderScreen()}
      
      {!props.isLinked &&
        <Group position="center" mt="xl">
          {step !== 0 && <MantineButton onClick={prev}>Back</MantineButton>}
          {step !== 4 && <MantineButton variant="default" onClick={next}>Next step</MantineButton>}
          {step === 4 && <MantineButton variant="default" onClick={_createPr}>Deploy</MantineButton>}
        </Group>
      }
    </Stack>
  );
}

export function useGithubAuth(code: string): [Octokit | null, null, boolean] {
  const router = useRouter();
  const [client, setClient] = useState<Octokit | null>(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  async function getAuth() {
    try {
      if (router.isReady && !client) {
        let _session = JSON.parse(sessionStorage.getItem("github-session") || '');

        if (!_session && code.length === 20) {
          const response = await fetch(`/api/auth/github?code=${code}`);
          _session = String(await response.json());
          sessionStorage.setItem("github-session", _session);

          router.push({
            pathname: router.pathname,
            query: Object.fromEntries(Object.entries(router.query).filter(([name, value]) => name !== "code")),
          });
        }

        if (_session.includes('ghu_')) {
          setClient(new Octokit({ auth: _session }));
        }
      }
    } catch (e: any) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getAuth();
  }, [code, router.isReady]);

  return [client, error, loading];
};

export type BuildRecords = Record<string, {icon: string, inputs: {name: string, label:string, select?: boolean, data?: string[] | {value: string, label: string}[], required: boolean}[]}>;

export const platforms:BuildRecords = {
  'Web': {
    icon: '/images/logos/globe.png',
    inputs: [
      {
        name: 'environment',
        label: 'Environment',
        data: [
          { value: 'node16', label: 'Node v16' }, 
        ],
        select: true,
        required: true, 
      },
      {
        name: 'framework',
        label: 'Framework',
        data: [
          { value: 'react', label: 'Create React App' }, 
          { value: 'next', label: 'NextJS' },
        ],
        select: true,
        required: true, 
      },
      { 
        name: 'installCommand',
        label: 'Install Command',
        required: true, 
      },
      { 
        name: 'buildCommand',
        label: 'Build Command',
        required: true, 
      },
      {
        name: 'outputFolder',
        label: 'Output Folder',
        required: true,
      },
    ],
  },
  'Mac': {
    icon: '/images/logos/mac.png',
    inputs: [],
  },
  'Windows': {
    icon: '/images/logos/windows.svg',
    inputs: [],
  },
  'Linux': {
    icon: '/images/logos/linux.png',
    inputs: [],
  },
  'Android': {
    icon: '/images/logos/android.svg',
    inputs: [],
  },
  'iOS': {
    icon: '/images/logos/ios.png',
    inputs: [],
  },
};

export const publishTypes: any = {
  'Valist Protocol': {
    icon: '/images/logo.png',
    inputs: [],
  },
  'iOS App Store': {
    icon: '/images/logos/appstore.png',
    inputs: ['APPLE_ID', 'APPLE_ID_PASSWORD'],
  },
  'macOS App Store': {
    icon: '/images/logos/appstore.png',
    inputs: ['APPLE_ID', 'APPLE_ID_PASSWORD'],
  },
  'Chrome Web Store': {
    icon: '/images/logos/chrome-web-store.png',
    inputs: ['TEST', 'TEST', 'TEST'],
  },
  'Microsoft Store': {
    icon: '/images/logos/microsoft-store.svg',
    inputs: ['TEST', 'TEST', 'TEST'],
  },
  'Google Play': {
    icon: '/images/logos/google-play.svg',
    inputs: ['SERVICE_ACCOUNT_JSON', 'PACKAGE_NAME'],
  },
  "Steam": {
    icon: '/images/logos/steam.png',
    inputs: ['SERVICE_ACCOUNT_JSON', 'PACKAGE_NAME'],
  },
  "Itch.io": {
    icon: '/images/logos/itch.png',
    inputs: ['SERVICE_ACCOUNT_JSON', 'PACKAGE_NAME'],
  },
};

export const integrations:Record<string, {icon: string, inputs: string[]}> = {
  'Twitter': {
    icon: '/images/logos/twitter.svg',
    inputs: ['CONSUMER_KEY', 'CONSUMER_SECRET', 'ACCESS_TOKEN_KEY', 'ACCESS_TOKEN_SECRET'],
  },
  'Discord': {
    icon: '/images/logos/discord.svg',
    inputs: ['DISCORD_TOKEN', 'DISCORD_WEBHOOK'],
  },
};