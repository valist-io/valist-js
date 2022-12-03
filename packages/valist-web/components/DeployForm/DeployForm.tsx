import { BuildManifest, buildYaml, checkRepoSecret, getRepos, getRepoSecrets, getWorkflows, webFrameworkDefaults } from "@/utils/github";
import { Button as MantineButton, Center, Group, Stack, Text, Textarea, Title } from "@mantine/core";
import { Octokit } from "@octokit/core";
import { Stepper } from "@valist/ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddKey } from "./screens/AddKey";
import { LoadingScreen } from "./screens/Loading";
import { SelectRepo } from "./screens/SelectRepo";
import { Workflows } from "./screens/Workflows";
import { ConfigureBuilds } from "./screens/ConfigureBuilds";
import { useForm } from "@mantine/form";
import { ChoosePublishers } from "./screens/ChoosePublishers";
import { AddIntegrations } from "./screens/AddIntegrations";
import { InstallApp } from "./screens/InstallApp";
import { randomBytes } from "crypto";
import { ethers } from "ethers";

export type GitProvider = {
  name: string; 
  icon: string;
  auth: string;
}
interface DeployFormProps {
  client: Octokit | null;
  account: string;
  project: string;
  linkRepo: (valistConfig: string) => Promise<void>;
  publicKey: string;
  setPrivateKey: (value: string) => void;
  setPublicKey: (value: string) => void;
  renewAuth: any;
  gitProviders: GitProvider[];
  repoPath: string;
  isLinked: boolean;
  onConnected?: () => void;
  onRepoSelect?: (repo: string) => void;
  onKeyAdded?: () => void;
  onPullRequest?: () => void;
}

export function DeployForm(props: DeployFormProps): JSX.Element {
  const router = useRouter();
  const [step, setStep] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [accessDenied, setAccessDenied] = useState<boolean>(false);
  const [pendingBuilds, setPendingBuilds] = useState<string[]>([]);
  const [pendingPublishers, setPendingPublishers] = useState<string[]>(['Valist Protocol']);

  const [isSigner, setIsSigner] = useState<boolean>(false);
  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [repoWorkflows, setRepoWorkflows] = useState<any[]>([]);
  const [repoSecrets, setRepoSecrets] = useState<string[]>([]);
  const owner = props?.repoPath?.split('/')[0];
  const repo = props?.repoPath?.split('/')[1];

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

  const installUrl = () => {
    const obj = { pathname: router?.pathname, query: router?.query };
    const state = Buffer.from(JSON.stringify(obj)).toString("base64");
    return `https://github.com/apps/valist-publish/installations/new?state=${state}`;
  };

  const _createKeyPair = async () => {
    const signer_key = randomBytes(32).toString('hex');
    const wallet = new ethers.Wallet(signer_key);
    props.setPublicKey(wallet?.address);
    props.setPrivateKey(wallet?.privateKey);
  };

  const _selectRepo = async (name: string) => {
    const [_owner, _repo] = name.split('/');
    if (!_owner && _repo) return;
    setLoading(true);

    if (props.onRepoSelect) props.onRepoSelect(name);
    if (props.client) {
      const resp = await checkRepoSecret(props.client, _owner, _repo);
      if (resp === 403) setAccessDenied(true);
      if (resp === 200) setIsSigner(true);
      if (resp === 404) setIsSigner(false);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _pullSecrets = async () => {
    if (!props.client || !owner || !repo) return;

    const resp = await getRepoSecrets(props.client, owner, repo);
    if (!resp) return;

    setRepoSecrets(resp.data.secrets.map((secret) => {
      return secret.name;
    }));
  };

  const _createPr = async () => {
    if (!props.client || !owner || !repo) return;
    await props.linkRepo(valistConfig);
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
      try {
        getRepos(props.client).then((repos) => {
          const names = repos?.data?.map((repo) => {
            return repo.full_name;
          });
  
          setUserRepos(names);
          if (names.length !== 0) _selectRepo(names[0]);
        });
      } catch (err) {
        console.log('Error fetching repos');
        console.log('Error', err);
        if (String(err).includes('Bad')) {
          console.log('Bad creds, getting new ones...');
          sessionStorage.removeItem('github-session');
          props.renewAuth();
        }
      }
    };
  }, [props.client]);

  // logging & debugging
  useEffect(() => {
    console.log('form values', form.values);
  }, [form.values]);

  // request user workflows if repo set
  useEffect(() => {
    if (props.client && owner && repo) {
      getWorkflows(props.client, owner, repo).then((data) => {
        const workflows = data?.data?.workflow_runs;
        if (workflows.length !== 0) setRepoWorkflows(workflows);
      });
    };
  }, [repo]);

  // request user secrets
  useEffect(() => {
     _pullSecrets();
  }, [repo]);

  // if framework changes update defaults
  useEffect(() => {
    // @ts-ignore
    const { installCommand, buildCommand, outputFolder } =  webFrameworkDefaults[form.values.build.web.framework];
    form.setFieldValue("build.web.installCommand", installCommand || '');
    form.setFieldValue("build.web.buildCommand", buildCommand || '');
    form.setFieldValue("build.web.outputFolder", outputFolder || '');
  }, [form.values.build.web.framework]);

  useEffect(() => {
    _createKeyPair();
  }, []);

  const renderScreen = () => {
    if ((props.client && !props.isLinked && userRepos.length === 0) || (props.isLinked && repoWorkflows.length === 0)) return <LoadingScreen />;
    if (accessDenied) {
      return <InstallApp redirectUrl={installUrl()} />;
    }
    if (props.isLinked && repoWorkflows) {
      return (
        <Workflows
          data={repoWorkflows} 
          logs={[]}
        />
      );
    }
    if (!props.isLinked && userRepos.length !== 0 && step === 0) {
      return (
        <section>
          <SelectRepo
            value={props.repoPath}
            repos={userRepos}
            onChange={_selectRepo} 
            onRepoSelect={async () => {}}
          />
          <AddKey
            account={props.account} 
            project={props.project} 
            repo={props.repoPath}
            publicKey={props.publicKey}
          />
          {isSigner &&
            <Text style={{ color: 'red' }}>Warning this will replace any existing VALIST_SIGNER on this GitHub repo!</Text>
          }
        </section>
      );
    }
    if (!props.isLinked && step === 1) {
      return (
        <ConfigureBuilds
          form={form} 
          secrets={repoSecrets}
          pending={pendingBuilds}
          setPending={setPendingBuilds}
        />
      );
    }
    if (!props.isLinked && step === 2) {
      return (
        <ChoosePublishers
          pending={pendingPublishers}
          setPending={setPendingPublishers} 
        />
      );
    }
    if (!props.isLinked && step === 3) {
      return (
        <AddIntegrations />
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
          {step !== 4 && 
            <MantineButton 
              variant="default" 
              onClick={!(step === 1 && pendingBuilds.length === 0) ? next : () => alert('Please, select at least 1 build type.')}>
                Next step
            </MantineButton>
          }
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
    let expiryTime = new Date(new Date().setHours(new Date().getHours() + 3)).getTime();

    try {
      if (router.isReady && !client) {
        let _session  = sessionStorage.getItem("github-session") || '';

        if (!_session.includes('ghu_') && code.length === 20) {
          const response = await fetch(`/api/auth/github?code=${code}`);
          _session = String(await response.json());
          sessionStorage.setItem("github-session", _session);
          sessionStorage.setItem("github-session-expiry", String(expiryTime));

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
      console.log(e);
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

export type BuildRecords = Record<string, {name: string, icon: string, inputs: {name: string, label:string, select?: boolean, data?: string[] | {value: string, label: string}[], required: boolean}[]}>;

export const platforms:BuildRecords = {
  'web': {
    name: 'Web',
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
          { value: 'next', label: 'NextJS' },
          { value: 'react', label: 'Create React App' }, 
          { value: 'other', label: 'Other' },
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
  'mac': {
    name: 'Mac',
    icon: '/images/logos/mac.png',
    inputs: [],
  },
  'windows': {
    name: 'Window',
    icon: '/images/logos/windows.svg',
    inputs: [],
  },
  'linux': {
    name: 'Linux',
    icon: '/images/logos/linux.png',
    inputs: [],
  },
  'android': {
    name: 'Android',
    icon: '/images/logos/android.svg',
    inputs: [],
  },
  'ios': {
    name: 'iOS',
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
