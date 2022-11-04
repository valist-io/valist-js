import { Trash } from 'tabler-icons-react';
import { Card, Text, Image } from "@mantine/core";
import query from '@/graphql/LibraryPage.graphql';
import { useLazyQuery } from '@apollo/client';
import { Metadata } from '../Metadata';
import { AppConfig } from '@/utils/electron';
import { useValist } from '@/utils/valist';
import { useEffect, useState } from 'react';
import { launch, uninstall } from '../Electron';
import { Project } from '@valist/sdk/dist/graphql';

interface LibraryProps {
  apps: Record<string, AppConfig>;
}

export function Library(props: LibraryProps): JSX.Element {
  const [appNames, setAppNames] = useState<string[]>([]);
  const valist = useValist();

  const [loadMetas, { data:projectMetas, loading }] = useLazyQuery<{projects: Project[]}>(query, { 
    variables: { projects: appNames },
  });

  useEffect(() => {
    setAppNames(Object.keys(props.apps));
  }, [props.apps]);

  useEffect(() => {
    if (appNames) loadMetas();
  }, [appNames, loadMetas]);

  return (
    <div style={{ padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>My Library</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {!loading && projectMetas?.projects.map((app, index) => (
          <Metadata key={index} url={app.metaURI!}>
            {data =>
              <Card
                shadow="sm"
                onClick={() => launch(app, data?.type, props.apps[app.id].path, valist)}
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
                <Trash onClick={async () => {
                  await uninstall(app?.id);
                  setAppNames(appNames.filter(e => e !== app.id));
                  alert("Successfully Uninstalled!");
                }} />
              </Card>
            }
          </Metadata>
        ))}
      </div>
    </div>
  );
};