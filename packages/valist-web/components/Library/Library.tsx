import { Trash } from 'tabler-icons-react';
import { Card, Text, Image } from "@mantine/core";
import query from '@/graphql/LibraryPage.graphql';
import { useQuery } from '@apollo/client';
import { Metadata } from '../Metadata';
import { AppConfig, launchApp } from '@/utils/electron';
import { useEffect, useState } from 'react';

interface LibraryProps {
  apps: Record<string, AppConfig>;
}

declare global {
  interface Window {
      valist: any;
  }
}

export function Library(props: LibraryProps): JSX.Element {
  const { data:projectMetas, loading } = useQuery(query, { 
    variables: { projects: Object.keys(props?.apps) ?? [] },
  });

  const [appNames, setAppNames] = useState<string[]>([]);
  
  const uninstallApp = async (appName: string) => {
    if (window?.valist) {
     const resp = await window?.valist?.uninstall(appName);
     alert(resp);

     setAppNames(appNames.filter(e => e !== appName));
    };
  };

  useEffect(() => {
    setAppNames(Object.keys(props?.apps));
  }, [props.apps]);

  console.log('appIDs', Object.keys(props?.apps));
  console.log('data', projectMetas?.projects && projectMetas?.projects[0]);

  return (
    <div style={{ padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>My Library</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {!loading && appNames?.map((app: any, index: number) => (
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