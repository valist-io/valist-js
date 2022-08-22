import { Trash } from 'tabler-icons-react';
import { Card, Text, Image } from "@mantine/core";
import query from '@/graphql/LibraryPage.graphql';
import { useQuery } from '@apollo/client';
import { Metadata } from '../Metadata';

interface LibraryProps {
  apps: Record<string, AppConfig>;
}

export type AppConfig = {
  "projectID": string;
  "version": string;
  "type": string;
  "path": string;
}

declare global {
  interface Window {
      valist: any;
  }
}

export const launchApp = async (appConfig: AppConfig) => {
  console.log('clicked with config', appConfig);
  if (appConfig.type === 'executable') {
    const resp  = await window.valist.launchApp(appConfig.path);
    console.log('response', resp);
  } else if (appConfig.type === 'web') {
    window.open(appConfig.path);
  }
};

export function Library(props: LibraryProps): JSX.Element {
  const uninstallApp = async (appName: string) => {
    if (window?.valist) {
     const resp = await window?.valist?.uninstall(appName);
     alert(resp);
    };
  };

  const { data:projectMetas, loading } = useQuery(query, { 
    variables: { projects: Object.keys(props?.apps) ?? [] },
  });

  console.log('appIDs', Object.keys(props?.apps));
  console.log('data', projectMetas?.projects && projectMetas?.projects[0]);

  return (
    <div style={{ padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>My Library</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {!loading && Object.keys(props?.apps)?.map((app: any, index: number) => (
          <Metadata key={index} url={projectMetas?.projects[index].metaURI}>
            {(data: any) =>
              <Card
              shadow="sm"
              onClick={() => launchApp(props.apps[app])}
              style={{ maxWidth: 250 }} 
              styles={() => ({
                '&:hover': {
                  border: '1px solid #5850EC',
                },
              })}
              p={40}
              >
                <Image
                  src={data?.image}
                  height={160}
                  alt="App"
                />
                <Trash onClick={() =>  uninstallApp(app) } />
              </Card>
            }
          </Metadata>
        ))}
      </div>
    </div>
  );
};