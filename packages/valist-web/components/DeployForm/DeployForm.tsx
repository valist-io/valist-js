import { addSecret, buildCommands, buildYaml, checkRepoSecret, createPullRequest, distLocation, environments, getRepos, getRepoSecrets, getWorkflows, installCommands, ProjectType } from "@/utils/github";
import { Stack, Text, Title } from "@mantine/core";
import { Octokit } from "@octokit/core";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AddKey } from "./screens/AddKey";
import { IndexScreen } from "./screens/Index";
import { LoadingScreen } from "./screens/Loading";
import { PullRequest } from "./screens/PullRequest";
import { SelectRepo } from "./screens/SelectRepo";
import { Workflows } from "./screens/Workflows";

interface DeployFormProps {
  account: string;
  clientID: string;
  project: string;
  onConnected?: () => void;
  onRepoSelect?: () => void;
  onKeyAdded?: () => void;
  onPullRequest?: () => void;
}

export type Screen = 'index' | 'loading' | 'selectRepo' | 'addKey' | 'pullRequest';

export function DeployForm(props: DeployFormProps): JSX.Element {
  const router = useRouter();
  const code = `${router.query.code || ''}`;

  const [screen, setScreen] = useState<Screen>('selectRepo');
  const [location, setLocation] = useState<string>('');
  const [client, setClient]= useState<Octokit | null>();

  const [userRepos, setUserRepos] = useState<string[]>([]);
  const [userWorkflows, setUserWorkflows] = useState<any[]>([]);
  const [repoSecrets, setRepoSecrets] = useState<string[]>([]);
  const [repoPath, setRepoPath] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [repo, setRepo] = useState<string>('');
  const [newSecretName, setNewSecretName] = useState<string>('');
  const [newSecretValue, setNewSecretValue] = useState<string>('');

  const [projectType, setProjectType] = useState<ProjectType>('next');

  const [environment, setEnvironment] = useState(environments[projectType]);
  const [installCommand, setInstallCommand] = useState(installCommands[projectType]);
  const [buildCommand, setBuildCommand] = useState(buildCommands[projectType]);
  const [outputPath, setOutputPath] = useState(distLocation[projectType]);

  const [valistConfig, setValistConfig] = useState<string>(buildYaml({
    account: props.account || '', 
    project: props.project || '', 
    environment,
    installCommand,
    buildCommand,
    outputPath,
  }));

  const _selectRepo = (name: string) => {
    const names = name?.split('/');
    const [_owner, _repo] = names;

    setRepoPath(name);
    setOwner(_owner);
    setRepo(_repo);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _pullSecrets = () => {
    if (!client || !owner || !repo) return;
    getRepoSecrets(client, owner, repo).then((secrets) => {
      setRepoSecrets(secrets.data.secrets.map((secret) => {
        return secret.name;
      }));
    });
  };

  const _addSecret = async () => {
    if (!client || !owner || !repo) return;
    await addSecret(client, owner, repo, newSecretName, newSecretValue);
    _pullSecrets();
  };

  // update yaml defaults
  useEffect(() => {
    setEnvironment(environments[projectType]);
    setInstallCommand(installCommands[projectType]);
    setBuildCommand(buildCommands[projectType]);
    setOutputPath(distLocation[projectType]);
  }, [projectType]);

  // update valist config
  useEffect(() => {
    const config = buildYaml({
      account: props.account || '', 
      project: props.project || '', 
      environment,
      installCommand,
      buildCommand,
      outputPath,
    });
    setValistConfig(config);
  } ,[buildCommand, environment, installCommand, outputPath, props.account, props.project]);

  // set window location
  useEffect(() => setLocation(String(window?.location)),[]);

  // request github auth code
  useEffect(() => {
    if (code?.length === 20 && !client) {
      try {
        fetch(`/api/auth/github?code=${code}`)
        .then(res => res.json())
        .then((data) => {
          const token = String(data);
          if (token.includes('ghu_')) {
            setClient(new Octokit({ auth: token }));
            props?.onConnected ? props.onConnected() : null;
          }
          
          router.push(`/-/account/${props.account}/project/${props.project}/settings`);
        });
      } catch(err) {
        console.log('error getting token', err);
      }
    };
  }, [code]);

  // request user repositories
  useEffect(() => {
    if (client) {
      getRepos(client).then((repos) => {
        const names = repos?.data?.map((repo) => {
          return repo.full_name;
        });

        setUserRepos(names);
        if (names.length !== 0) _selectRepo(names[0]);
      });
    };
  }, [client]);

  // request user workflows
  useEffect(() => {
    if (client && owner && repo) {
      getWorkflows(client, owner, repo).then((data) => {
        console.log('workflows', data);
        const workflows = data?.data?.workflows;
        if (workflows.length !== 0) setUserWorkflows(workflows);
      });
    };
  }, [repo]);

  // request user secrets
  useEffect(() => {
     _pullSecrets();
  }, [repo]);

  const renderScreen = () => {
    if (client && userRepos.length === 0) return <LoadingScreen />;
    if (!client) return (
      <IndexScreen 
        clientID={props.clientID} 
        location={location} 
      />
    );
    if (client && screen === 'selectRepo') return (
      <SelectRepo
        value={repoPath}
        repos={userRepos}
        onChange={_selectRepo} 
        onRepoSelect={async () => {
          if (client && repo) {
            const isSigner = await checkRepoSecret(client, owner, repo);
            setScreen(isSigner ? 'pullRequest' : 'addKey');
          }
          if (props.onRepoSelect) props.onRepoSelect();
        }}
      />
    );
    if (client && screen === 'addKey') return (
      <AddKey 
        repo={repoPath}
        account={props.account}
        project={props.project}
        back={() => setScreen('selectRepo')}
      />
    );
    if (client && screen === 'pullRequest') return (
      <PullRequest 
        back={() => setScreen('selectRepo')}
        createPR={() => createPullRequest(client, valistConfig, owner, repo)}
        projectType={projectType}
        output={outputPath}
        installCommand={installCommand}
        buildCommand={buildCommand}
        repo={repoPath}
        secrets={repoSecrets}
        newSecretName={newSecretName}
        newSecretValue={newSecretValue}
        setSecretName={setNewSecretName}
        setSecretValue={setNewSecretValue}
        setProjectType={setProjectType}
        setBuildCommand={setBuildCommand}
        setInstallCommand={setInstallCommand}
        setOutputFolder={setOutputPath}
        valistConfig={valistConfig} 
        addSecret={_addSecret}      
      />
    );
    // if (client && userWorkflows) return (
    //   <Workflows data={userWorkflows} />
    // );
  };

  return (
    <Stack style={{ maxWidth: 784 }}>
      <Title mt="lg">Deployments</Title>
      <Text color="dimmed">Configure automatic deployments, continuous integration, and source control.</Text>
      <Title order={2}>Repository</Title>
      {renderScreen()}
    </Stack>
  );
}