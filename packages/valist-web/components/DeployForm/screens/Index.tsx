import { Card, Text, Title } from "@mantine/core";
import Image from 'next/image';

export type GitProvider = {
  name: string;
  icon: string;
  auth: string;
}

interface IndexScreenProps {
  clientID: string;
  location: string;
}

export function IndexScreen(props:IndexScreenProps):JSX.Element {
  const gitProviders = [
    {
        name: 'Github',
        icon: '/images/github.svg',
        auth: `https://github.com/login/oauth/authorize?scope=repo%2Cworkflow&client_id=${props.clientID}&state=${Buffer.from(props.location).toString("base64")}`,
    },
  ];

  const getAuth =(authURL: string) => {
    window.location.assign(authURL);
  };

  return ( 
    <section>
      <Text>
        This project is not currently linked to a source code repository.
      </Text>
     
      <Text style={{ marginBottom: 20 }}>Choose your preferred git provider to enable automatic deployments.</Text>

      {gitProviders.map((provider) => (
        <button
          key={provider.name}
          style={{ width: 200 }} 
          onClick={() => getAuth(provider.auth)}
        >
          <Image height={25} width={25} alt="githubLogo" src={provider.icon} />
          <span style={{ fontSize: 25, marginLeft: 10 }}>{provider.name}</span>
        </button>
      ))}
    </section>
  );
}