import { Text } from "@mantine/core";
import Image from 'next/image';

export type GitProvider = {
  name: string;
  icon: string;
  auth: string;
}

interface IndexScreenProps {
  gitProviders: GitProvider[];
  repo?: string;
}

export function IndexScreen(props:IndexScreenProps):JSX.Element {
  const getAuth =(authURL: string) => {
    window.location.assign(authURL);
  };

  return ( 
    <section>
      {!props.repo &&
        <>
          <Text>
            This project is not currently linked to a source code repository.
          </Text>
        
          <Text style={{ marginBottom: 20 }}>Choose your preferred git provider to enable automatic deployments.</Text>

          {props?.gitProviders.map((provider) => (
            <button
              key={provider.name}
              style={{ width: 200 }} 
              onClick={() => getAuth(provider.auth)}
            >
              <Image height={25} width={25} alt={provider.name + 'Logo'} src={provider.icon} />
              <span style={{ fontSize: 25, marginLeft: 10 }}>{provider.name}</span>
            </button>
          ))}
        </>
      }
      {props.repo &&
        <>
          <Text>
            This project is currently linked to the GitHub repository {props.repo}.
          </Text>
        </>
      }
    </section>
  );
}