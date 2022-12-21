import type { NextPage } from 'next';
import type { FileWithPath } from 'file-selector';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { Collapse } from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useApolloClient, useQuery } from '@apollo/client';
import { Layout } from '@/components/Layout';
import { NameInput } from '@/components/NameInput';
import { getChainId } from '@/utils/config';
import { useValist } from '@/utils/valist';
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
  Breadcrumbs,
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
import { ProjectMeta, SupportedPlatform, platformNames } from '@valist/sdk';
import { Metadata } from '@/components/Metadata';

const CreateReleasePage: NextPage = () => {
  const router = useRouter();
  const { cache } = useApolloClient();
  const valist = useValist();

  const { address } = useAccount();
  const chainId = getChainId();

  const accountName = `${router.query.account}`;
  const accountId = valist.generateID(chainId, accountName);

  const projectName = `${router.query.project}`;
  const projectId = valist.generateID(accountId, projectName);

  const { data } = useQuery(query, { 
    variables: { projectId }, 
  });

  const latestReleaseName = data?.project?.releases?.[0]?.name;

  // form values
  const openRef = useRef<() => void>(null);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File>();
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [filesObject, setFilesObject] = useState<Record<string, File[]>>({});
  const [activeTab, setActiveTab] = useState<string | null>();
  const [opened, setOpened] = useState(false);

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

    createRelease(
      address,
      projectId,
      image,
      filesObject,
      values,
      valist,
      cache,
      chainId,
    ).then(success => {
      if (success) {
        router.push(`/${accountName}/${projectName}`);  
      }
    }).finally(() => {
      setLoading(false);  
    });
  };

  const breadcrumbs = [
    { title: accountName, href: `/${accountName}` },
    { title: projectName, href: `/${accountName}/${projectName}` },
    { title: 'Create Release', href: `/-/account/${accountName}/project/${projectName}/create/release` },
  ];

  useEffect(() => {
    const _filesObject = { ...filesObject };
    _filesObject.web = files;
    setFilesObject(_filesObject);
    console.log('filesObject', filesObject);
  }, [files]);

  return (
    <Metadata url={data?.project?.metaURI}>
      {(projectMeta: ProjectMeta) => (
        <form onSubmit={form.onSubmit(submit)}>
          <Layout>
            <div style={{ paddingBottom: 32 }}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
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
                  <Group spacing={40} grow>
                    <ImageInput 
                      width={300}
                      height={300}
                      onChange={setImage} 
                      value={image}
                      disabled={loading}
                      openRef={openRef}
                    />
                    <Stack align="flex-start">
                      <Title order={2}>Release Image</Title>
                      <Text>
                        Click below to upload or drag and drop. 
                        Formats available are SVG, PNG, JPG (max. 800x800px)
                      </Text>
                      <Button mt={24} onClick={openRef.current}>
                        Change Image
                      </Button>
                    </Stack>
                  </Group>
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
                      <Text color="dimmed">Upload your release files to the designated platform target.</Text>
                      <Text weight={900} color="dimmed">At least one platform is required.</Text>
                      <h3>Web</h3>
                      {(Object.keys(platformNames) as SupportedPlatform[]).map((platform, index) => (
                        <div key={index}>
                          <Text style={{ display: 'inline-block', width: 300 }}>{platformNames[platform]}</Text>

                          {platform === 'web' &&
                            <>
                              <FileButton directory={true} setFiles={(_files: File[]) => {
                                setFilesObject({ ...filesObject, [platform]: _files });
                              }} />
                              {filesObject[platform] && filesObject[platform].length !== 0  &&
                                 <span style={{ marginLeft: 20, cursor: 'pointer' }} onClick={() => setOpened((o) => !o)}>
                                 - {filesObject[platform].length} files
                                </span>
                              }
                              <Collapse in={opened}>
                                <ScrollArea style={{ height: 300 }}>
                                  <Stack spacing={12}>
                                    {filesObject?.web?.map((file: FileWithPath, index: number) => 
                                      <File
                                        key={index}
                                        path={file.webkitRelativePath || file.path || file.name}
                                        size={file.size}
                                      />,
                                    )}
                                  </Stack>
                                </ScrollArea>
                              </Collapse>
                              <br/>
                              <br/>
                              <h3>Desktop / Mobile</h3>
                            </>
                          }

                          {platform !== 'web' &&
                            <>
                              <FileButton setFiles={(_files: File[]) => {
                                setFilesObject({ ...filesObject, [platform]: _files });
                              }} />
                              {filesObject[platform] && filesObject[platform].length !== 0  &&
                                <span style={{ marginLeft: 20 }}>
                                - {filesObject[platform].length} files
                              </span>
                              }
                            </>
                          }
                        </div>
                      ))}
                      <br />
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