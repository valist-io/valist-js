import Image from 'next/image';
import { Group, Text, Button as MantineButton, Center } from "@mantine/core";
import { useForm } from "@mantine/form";
import { Stepper } from "@valist/ui";
import { useState } from "react";

interface PullRequestProps {
  back: any;
  addSecret: any;
  createPR: any;
  projectType: string;
  repo: string;
  output: string;
  buildCommand: string;
  installCommand: string;
  secrets: string[];
  workflows: any;
  newSecretName: string;
  newSecretValue: string;
  logs: any[];
  fetchLogs: any;
  setSecretName: any;
  setSecretValue: any;
  setProjectType: any;
  setInstallCommand: any;
  setBuildCommand: any;
  setOutputFolder: any;
  valistConfig: string;
}

const platforms = ['Web', 'Android', 'ios', 'Mac'];
const publishTypes:Record<string, {icon: string, inputs: string[]}> = {
  'Just Valist': {
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
  // 'Chrome WebStore': {
  //   icon: '/images/logos/chrome-web-store.png',
  //   inputs: ['TEST', 'TEST', 'TEST'],
  // },
  'Microsoft Store': {
    icon: '/images/logos/microsoft-store.svg',
    inputs: ['TEST', 'TEST', 'TEST'],
  },
  'Google Play': {
    icon: '/images/logos/google-play.svg',
    inputs: ['SERVICE_ACCOUNT_JSON', 'PACKAGE_NAME'],
  },
};

const androidFrameworks = {
  'Vanilla Android': {
    inputs: [],
  }, 
  'Capacitor': {
    inputs: [],
  },
};

const iosFrameworks = ['Vanilla ios', 'Capacitor'];
const macFrameworks = ['Vanilla Mac App', 'Electron'];

export function PullRequest(props: PullRequestProps):JSX.Element {
  const [showConfig, setShowConfig] = useState(false);
  const [_platforms, _setPlatforms] = useState<string[]>([]);
  const [_publishTypes, _setPublishTypes] = useState<string[]>([]);
  const [_integrations, _setIntegrations] = useState<string[]>([]);

  const [step, setStep] = useState<number>(0);

  const form = useForm({
    initialValues: {
      environments: {
        
      },
      builds: {

      },
      publishing: {

      },
    },
  });

  const steps =[
    { label: "Step 1", description: "Connect your repo", text: "Step 1: Connect your repository!" },
    { label: "Step 2", description: "Choose where to publish", text: "Step 2: Choose where you'd like to Publish!" },
    { label: "Step 3", description: "Configure your builds", text: "Step 3: Configure your builds" },
    { label: "Step 4", description: "Add integrations", text: "Step 4: Add integrations" },
  ];
  const totalSteps = steps.length;
  const nextStep = step + 1;
  const prevStep = step - 1;
  const next = () => setStep(nextStep <= totalSteps ? nextStep : step);
  const prev = () => setStep(prevStep >= 0 ? prevStep : step);

  return (
    <section>
      <br />
      <br />

      <Group position="center" mt="xl">
        <MantineButton onClick={prev}>Back</MantineButton>
        <MantineButton variant="default" onClick={next}>Next step</MantineButton>
      </Group>

      {/* <Title my="lg" order={2}>Choose where you&lsquo;d like to Publish</Title> */}
      {/* <MultiSelect
        data={Object.keys(publishTypes)}
        placeholder="Choose them all if you want!"
        onChange={_setPublishTypes}
        searchable
      /> */}

      {/* <ScrollArea style={{ height: 350 }}>
        {_publishTypes?.map((item) => (
          <Card key={item} my='lg'>
            {item}
            {publishTypes[item] && publishTypes[item].inputs.map((input: string) => (
              <TextInput 
                key={item}
                label={input}
                style={{ width: '40%' }}
              />
            ))}
          </Card>
        ))}
      </ScrollArea>

      <br />
      <Title my="lg" order={2}>Configure your Builds</Title>
      <MultiSelect
        data={platforms}
        placeholder="Choose them all if you want!"
        onChange={_setPlatforms}
        searchable
      />

      <ScrollArea style={{ height: 350 }}>
        {_platforms?.map((item) => (
          <Card key={item} my='lg'>
            <Grid>
              <Grid.Col span={1}>
                {item}
              </Grid.Col>
              <Grid.Col span={12}>
                <Group my='lb'>
                  <Select
                    label="Project Type"
                    style={{ width: '40%' }}
                    data={[{ value: 'react', label: 'Create React App' }, { value: 'next', label: 'NextJS' }]}
                    onChange={(value) => props.setProjectType(value as ProjectType)}
                    value={props.projectType}
                  />
                  <TextInput
                    label="Install Command"
                    style={{ width: '40%' }}
                    value={props.installCommand}
                    onChange={(event) => props.setInstallCommand(event.currentTarget.value)}
                  />
                </Group>
                <Group my='lg'>
                  <TextInput 
                    label="Build Command"
                    style={{ width: '40%' }}
                    value={props.buildCommand}
                    onChange={(event) => props.setBuildCommand(event.currentTarget.value)}
                  />
                  <TextInput 
                    label="Output Folder"
                    style={{ width: '40%' }}
                    value={props.output}
                    onChange={(event) => props.setOutputFolder(event.currentTarget.value)}
                  />
                </Group>
              </Grid.Col>
            </Grid>
          </Card>
          ))}
      </ScrollArea>

      <Title my="lg" order={2}>Add Integrations</Title>
      <MultiSelect
        data={Object.keys(integrations)}
        placeholder="Choose them all if you want!"
        onChange={_setIntegrations}
        searchable
      />
      {_integrations?.map((item) => (
        <Card key={item} my='lg'>
          {item}
          {integrations[item] && integrations[item].inputs.map((input: string) => (
            <TextInput 
              key={item}
              label={input}
              style={{ width: '40%' }}
            />
          ))}
        </Card>
      ))} */}
      {/* <br />
      <Title my="lg" order={2}>Environment Variables</Title>
        <Group my='lg'>
          <TextInput
            placeholder="Secret name"
            onChange={(event) => props.setSecretName(event.currentTarget.value)}
            value={props.newSecretName} 
          />
          <TextInput
            placeholder="Secret value"
            onChange={(event) => props.setSecretValue(event.currentTarget.value)}
            value={props.newSecretValue} 
          />
          <Button onClick={props.addSecret}>Add</Button>
        </Group>
        {props?.secrets?.map((secret) => (
          <Group key={secret} my='lg'>
            <TextInput
              value={secret}
              onChange={() => {}} 
            />
            <TextInput
              placeholder="*********"
              type='password'
            />
          </Group>
        ))} */}
      {/* <Collapse in={showConfig}>
        <br />
        <Textarea
          value={props.valistConfig}
          style={{ width: 750 }}
          disabled
          size="xl"
          minRows={13}
        />
      </Collapse>
      <br />
      <Group my="lg">
        <Button onClick={() => setShowConfig((o) => !o)}>
          Show Config
        </Button>
        <Button onClick={props.createPR}>Create Pull Request</Button>
      </Group> */}
    </section>
  );
}