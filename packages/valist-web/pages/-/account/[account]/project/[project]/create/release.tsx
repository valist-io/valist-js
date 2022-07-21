import type { NextPage } from 'next';
import type { FileWithPath } from 'file-selector';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { useForm, zodResolver } from '@mantine/form';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import query from '@/graphql/CreateReleasePage.graphql';

import {
  schema,
  FormValues,
  createRelease,
} from '@/forms/create-release';

import {
  Button,
  ImageInput,
  TextInput,
  Textarea,
  FileInput,
  File,
  Card,
  Tabs,
} from '@valist/ui';

import { 
  Group,
  Stack,
  Title,
  Text,
  ScrollArea,
} from '@mantine/core';

const CreateReleasePage: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const valist = useContext(ValistContext);

  const { address } = useAccount();
  const { chain } = useNetwork();  

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 0, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { 
    variables: { projectId }, 
  });

  const latestReleaseName = data?.project?.releases?.[0]?.name;

  // form values
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [files, setFiles] = useState<FileWithPath[]>([]);

  // form controls
  const [active, setActive] = useState(0);
  const nextStep = () => setActive(active < 1 ? active + 1 : active);
  const prevStep = () => setActive(active > 0 ? active - 1 : active);

  const form = useForm<FormValues>({
    schema: zodResolver(schema),
    initialValues: {
      releaseName: '',
      displayName: '',
      description: '',
    },
  });

  const submit = (values: FormValues) => {
    setLoading(true);
    createRelease(
      address,
      projectId,
      image,
      files,
      values,
      valist,
      cache,
    ).then(success => {
      if (success) {
        router.push(`/${accountName}/${projectName}`);  
      }
    }).finally(() => {
      setLoading(false);  
    });
  };

  return (
    <Layout
      breadcrumbs={[
        { title: accountName, href: `/${accountName}` },
        { title: projectName, href: `/${accountName}/${projectName}` },
        { title: 'Create Release', href: `/-/account/${accountName}/project/${projectName}/create/release` },
      ]}
    >
      <Tabs active={active} onTabChange={setActive} grow>
        <Tabs.Tab label="Basic Info">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Basic Info</Title>
            <Text color="dimmed">This is your public release info.</Text>
            <Title order={2}>Release Image</Title>
            <ImageInput 
              width={300}
              height={300}
              onChange={setImage} 
              value={image}
              disabled={loading}
            />
            <Title order={2}>Release Details</Title>
            <TextInput 
              label="Release Name (cannot be changed)"
              placeholder={latestReleaseName}
              disabled={loading}
              required
              {...form.getInputProps('releaseName')}
            />
            <TextInput 
              label="Display Name"
              disabled={loading}
              required
              {...form.getInputProps('displayName')}
            />
            <Textarea
              label="Description"
              disabled={loading}
              autosize={true}
              minRows={4}
              maxRows={12}
              {...form.getInputProps('description')}
            />
          </Stack>
        </Tabs.Tab>
        <Tabs.Tab label="Files">
          <Stack style={{ maxWidth: 784 }}>
            <Title mt="lg">Files</Title>
            <Text color="dimmed">Upload your release files.</Text>
            <FileInput
              onChange={setFiles}
              value={files}
              disabled={loading}
            />
            <ScrollArea style={{ height: 300 }}>
              <Stack spacing={12}>
                {files.map((file: FileWithPath, index: number) => 
                  <File 
                    key={index} 
                    path={file.path ?? file.name} 
                    size={file.size} 
                  />,
                )}
              </Stack>
            </ScrollArea>
          </Stack>
        </Tabs.Tab>
      </Tabs>
      <Group mt="lg">
        { active > 0 && 
          <Button onClick={() => prevStep()} variant="secondary">Back</Button>
        }
        { active < 1 &&
          <Button onClick={() => nextStep()} variant="primary">Continue</Button>
        }
        { active === 1 &&
          <Button onClick={form.onSubmit(submit)} disabled={loading}>Create</Button>
        }
      </Group>
    </Layout>
  );
};

export default CreateReleasePage;