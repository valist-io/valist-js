import { platforms } from "../DeployForm";
import Image from 'next/image';
import { Button as MantineButton, Center, Group, Select, Text, TextInput, Title } from "@mantine/core";
import { Fragment, useState } from "react";
import { UseFormReturnType } from "@mantine/form";

interface ConfigureBuildsProps {
  form: UseFormReturnType<any>;
  secrets: string[];
}

export function ConfigureBuilds(props: ConfigureBuildsProps):JSX.Element {
  const [pending, setPending] = useState<string[]>([]);

  const togglePlatform = (platform: string) => pending.includes(platform) ? setPending(pending.filter((p) => p !== platform)) : setPending([...pending, platform]);
  const activeStyle = (platform: string) => pending.includes(platform) ? 'solid 5px #820cd8' : undefined;

  return (
    <section>
      <Center><Text>All builds are also published to Valist</Text></Center>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', margin: '0 auto' }}>
        {Object.keys(platforms).map((platform) => (
          <button
            key={platform}
            style={{ width: 240, margin: 20, border: activeStyle(platform) }}
            onClick={() => togglePlatform(platform)}
          >
            <span><Image style={{ display: 'block' }} height={55} width={55} alt={platform + 'Logo'} src={platforms[platform].icon} /></span>
            <span style={{ fontSize: 25, display: 'block' }}>{platform}</span>
          </button>
        ))}
      </div>

      <Title my="lg" order={3}>Required Platform Variables</Title>
      <div style={{ padding: '5px 0 10px 0' }}>
        {pending?.length === 0 && 
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 180 }}>
            <div>No platforms selected</div>
          </div>
        }
        {pending.map((platform) => (
          <div key={platform}>
            <Title my="lg" order={4}>{platform}</Title>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {platforms[platform]?.inputs.map((input, index) => (
                <Fragment key={input?.name + index}>
                  {input.select && input.data &&
                    <Select
                      data={input.data}
                      my="xl"
                      style={{ margin: 20, width: '40%' }}
                      label={input?.label}
                      required={input?.required}
                      {...props.form.getInputProps(`build.${platform}.${input.name}`)}
                    />
                  }
                  {!input.select &&
                    <TextInput
                      my="xl"
                      style={{ margin: 20, width: '40%' }}
                      label={input?.label}
                      required={input?.required}
                      {...props.form.getInputProps(`build.${platform}.${input.name}`)}
                    />
                  }
                </Fragment>
              ))}
            </div>
            <hr style={{ margin: '20px 0' }}></hr>
          </div>
        ))}
      </div>
      
      <Title my="lg" order={3}>Other Build Variables</Title>
      <div style={{ marginLeft: 23 }}>
        <VariableInput value={""} placeholder={"VARIABLE_NAME"} disabled={false} />
        {props.secrets?.map((secret) => (
          <Group key={secret} my='lg'>
            <TextInput
              value={secret}
              onChange={() => {}}
              disabled={true}
            />
            =
            <TextInput
              placeholder="*********"
              type='password'
              disabled={secret === 'VALIST_SIGNER'}
            />
          </Group>
        ))}
      </div>
    </section>
  );
};

interface VariableInputProps {
  value: string;
  placeholder: string;
  disabled: boolean;
}

function VariableInput(props: VariableInputProps):JSX.Element {
  return (
    <Group my='lg'>
      <TextInput
        value={props.value}
        placeholder={props.placeholder}
        onChange={() => {}}
        disabled={props.disabled} 
      />
      =
      <TextInput
        placeholder="*********"
        type='password'
        disabled={props.disabled}
      />
      <MantineButton color="violet" size="md">Add</MantineButton>
    </Group>
  );
}