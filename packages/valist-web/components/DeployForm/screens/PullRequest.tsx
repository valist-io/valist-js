import { ProjectType } from "@/utils/github";
import { Collapse, Group, Select, Textarea, TextInput, Title } from "@mantine/core";
import { Button } from "@valist/ui";
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
  newSecretName: string;
  newSecretValue: string;
  setSecretName: any;
  setSecretValue: any;
  setProjectType: any;
  setInstallCommand: any;
  setBuildCommand: any;
  setOutputFolder: any;
  valistConfig: string;
}

export function PullRequest(props: PullRequestProps):JSX.Element {
  const [showConfig, setShowConfig] = useState(false);
  
  return (
    <section>
      <Group style={{ marginBottom: 20 }}>
       <Button variant="subtle" onClick={(() => props.back())}>Choose a different repo</Button>
       <Select
          value={props.repo} 
          data={[props.repo]}
          disabled
        />
      </Group>
      <Title mb="lg" order={2}>Build Settings</Title>
      <Group mb='lg'>
        <Select
          label="Project Type"
          style={{ width: '40%' }}
          data={[{ value: 'react', label: 'Create React App' }, { value: 'next', label: 'NextJS' }, { value: 'go', label: 'Go' }]}
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
        <Group mb='lg'>
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
      <Title mb="lg" order={2}>Environment Variables</Title>
      <div style={{ marginBottom: 0 }}>
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
        ))}
      </div>
     
      <Collapse in={showConfig}>
        <br />
        <Textarea
          value={props.valistConfig}
          style={{ width: 750 }}
          disabled
          size="xl"
          minRows={13}
        />
      </Collapse>
      <Group my="lg">
        <Button onClick={() => setShowConfig((o) => !o)}>
          Show Config
        </Button>
        <Button onClick={props.createPR}>Create Pull Request</Button>
      </Group>
    </section>
  );
}