import { Card, Text, Image } from "@mantine/core";
import { useContext } from "react";
import { ValistContext } from "../ValistProvider";

interface LibraryProps {
  appNames: AppConfig[];
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
  if (appConfig.type === 'executable') {
    const resp  = await window.valist.launchApp(appConfig.path);
    console.log('response', resp);
  } else if (appConfig.type === 'web') {
    window.open(appConfig.path);
  }
};

const images = [
  'https://ipfs.filebase.io/ipfs/QmWUDL4qBjRrPJPLT7dDRiN34FrhuaWStQcpKL7mk2Fh3z',
  'https://gateway.valist.io/ipfs/QmRACojSdFuqnyyfQZ9Zgiz6zrVCUX1JRkYZyvRGu1MCzG',
  'https://ipfs.filebase.io/ipfs/QmbDdrbUprrnohcMXc1Ym5Kwur67bvXCstC28eJCuHTtqw',
  'https://ipfs.filebase.io/ipfs/QmQUDTiNxhwXH724cBMpBQd2CtJVGmTBMwfqMevrwjDo6B',
  'https://gateway.valist.io/ipfs/QmbzQKtt2Z4EU5TdydM1pgxBvp1C1Sw57kXo7KyeZ11A9s',
];

export function Library(props: LibraryProps): JSX.Element {
  const valist = useContext(ValistContext);
  const getMeta = async (projectID: string) => {
    const meta = await valist?.getProjectMeta(projectID);
    meta.image;
  };

  return (
    <div style={{ padding: 20 }}>
      <Text style={{ fontSize: 35, marginBottom: 20 }}>My Library</Text>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
        {props.appNames?.map((app: any, index: number) => (
          <Card
            key={index}
            shadow="sm"
            onClick={() => launchApp(app)}
            style={{ maxWidth: 250 }} 
            styles={() => ({
              '&:hover': {
                border: '1px solid #5850EC',
              },
            })}
          >
            <Card.Section>
              <Image
                src={images[index]}
                height={160}
                alt="App"
              />
            </Card.Section>
      
            <Text weight={500} size="lg" mt="md">
              {app.name}
            </Text>
          </Card>
        ))}
      </div>
    </div>
  );
};