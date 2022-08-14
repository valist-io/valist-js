import { Trash } from 'tabler-icons-react';
import { Card, Text, Image } from "@mantine/core";
import { useContext } from "react";
import { ValistContext } from "../ValistProvider";

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
  const valist = useContext(ValistContext);
  // const getMeta = async (projectID: string) => {
  //   const meta = await valist?.getProjectMeta(projectID);
  //   meta.image;
  // };

  const uninstallApp = async (appName: string) => {
    if (window?.valist) {
     const resp = await window?.valist?.uninstall(appName);
     console.log('Response', resp);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>My Library</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {Object.keys(props?.apps)?.map((app: any, index: number) => (
          <Card
            key={index}
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
            {/* <Image
              src={images[index]}
              height={160}
              alt="App"
            /> */}
            <Trash onClick={() =>  uninstallApp(app) } />
          </Card>
        ))}
      </div>
    </div>
  );
};