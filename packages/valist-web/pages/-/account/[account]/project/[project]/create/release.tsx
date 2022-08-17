import type { NextPage } from 'next';
import type { FileWithPath } from 'file-selector';
import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useNetwork } from 'wagmi';
import { useForm, zodResolver } from '@mantine/form';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { ValistContext } from '@/components/ValistProvider';
import { NameInput } from '@/components/NameInput';
import query from '@/graphql/CreateReleasePage.graphql';

import {
  schema,
  FormValues,
  createRelease,
} from '@/forms/create-release';

import {
  Button,
  ImageInput,
  FileButton,
  FileInput,
  File,
} from '@valist/ui';

import { 
  Group,
  Stack,
  Title,
  Text,
  TextInput,
  Textarea,
  ScrollArea,
  Tabs,
} from '@mantine/core';
import { InstallMeta, ProjectMeta } from '@valist/sdk';
import { Metadata } from '@/components/Metadata';

const CreateReleasePage: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const valist = useContext(ValistContext);

  const { address } = useAccount();
  const { chain } = useNetwork();  

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chain?.id ?? 137, accountName);

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
  const [filesObject, setFilesObject] = useState<Record<string, any>>({});
  const [platforms, setPlatforms] = useState<string[]>(["windows_arm64", "windows_amd64", "linux_arm64", "linux_amd64", "darwin_arm64", "darwin_amd64"]);
  const [activeTab, setActiveTab] = useState<string | null>();
  
  const form = useForm<FormValues>({
    validate: zodResolver(schema),
    validateInputOnChange: true,
    initialValues: {
      releaseName: '',
      displayName: '',
      description: '',
    },
  });

  const tabProps = { 
    disabled: !(form.values.releaseName && form.values.displayName) ? true : false,
  };

  const submit = (values: FormValues) => {
    setLoading(true);
    const platformFiles = Object.values(filesObject);
    const isInstall = Object.keys(filesObject).length !== 0;
    let installMeta: InstallMeta | undefined = undefined;

    if (isInstall) {
      installMeta = new InstallMeta();
      Object.keys(filesObject).forEach((platform) => {
        if (filesObject[platform]) {
          // @ts-ignore
          installMeta[platform] = filesObject[platform].name;
        }
      });
    };

    const _files =  isInstall ? platformFiles : files;

    createRelease(
      address,
      projectId,
      image,
      _files,
      installMeta,
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
    <Metadata url={data?.project?.metaURI}>
      {(data: ProjectMeta) => (
        <form onSubmit={form.onSubmit(submit)}>
          <Layout
            breadcrumbs={[
              { title: accountName, href: `/${accountName}` },
              { title: projectName, href: `/${accountName}/${projectName}` },
              { title: 'Create Release', href: `/-/account/${accountName}/project/${projectName}/create/release` },
            ]}
          >
            <Tabs
              defaultValue="basic"
              value={activeTab}
              onTabChange={setActiveTab}
            >
              <Tabs.List grow>
                <Tabs.Tab value="basic">Basic Info</Tabs.Tab>
                <Tabs.Tab {...tabProps} value="files">Files</Tabs.Tab>
              </Tabs.List>
              <Tabs.Panel value="basic">
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
                  <NameInput 
                    label="Release Name (cannot be changed)"
                    placeholder={latestReleaseName}
                    disabled={loading}
                    parentId={projectId}
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
                <Group mt="lg">
                  <Button 
                    onClick={() => setActiveTab('files')}
                    variant="primary"
                    disabled={!(form.values.releaseName && form.values.displayName)}
                  >
                    Continue
                  </Button>
                </Group>
              </Tabs.Panel>
              <Tabs.Panel value="files">
                <Stack style={{ maxWidth: 784 }}>
                  <Title mt="lg">Files</Title>
                  {!['native', 'cli'].includes(data?.type as string) &&
                  <>
                    <Text color="dimmed">Upload your release files.</Text>
                    <FileInput
                      onChange={setFiles}
                      value={files}
                      disabled={loading}
                    />
                  </>
                  }
                  {['native', 'cli'].includes(data?.type as string) &&
                    <>
                      <Text color="dimmed">Upload your release files to the designated platform target.</Text>
                      <Text weight={900} color="dimmed">At least one platform is required.</Text>
                      <br/>
                      {platforms.map((platform, index) => (
                        <div key={index}>
                          <Text style={{ display: 'inline-block', width: 150 }}>{platform}</Text>
                          <FileButton setFiles={(_files: File[]) => {
                            setFilesObject({ ...filesObject, [platform]: _files });
                          }} />
                          {filesObject[platform] && filesObject[platform].length !== 0 && 
                            <span style={{ marginLeft: 20 }}>- {filesObject[platform].name}</span>
                          }
                        </div>
                      ))}
                   </>
                  }
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
                <Group mt="lg">
                  <Button
                    onClick={() => setActiveTab('basic')} 
                    variant="secondary"
                  >
                    Back
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                  >
                    Create
                  </Button>
                </Group>
              </Tabs.Panel>
            </Tabs>
          </Layout>
        </form>
      )}
    </Metadata>
  );
};

export default CreateReleasePage;
