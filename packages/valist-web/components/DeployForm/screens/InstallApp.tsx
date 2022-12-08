import { Center, Title } from "@mantine/core";
import { LogoButton } from "../LogoButton";

interface InstallAppProps {
  redirectUrl: string;
}

export function InstallApp(props: InstallAppProps):JSX.Element {
  return (
    <section>
      <Center><Title my="lg" order={3}>Unable to connect to repo. Please install Valist GitHub App </Title></Center>
      <LogoButton
        onClick={() => {
          window?.location?.assign(
            props.redirectUrl,
          );
        }}
        text={'Install Github App'}
        image={'/images/logos/github.svg'} 
        active={false}
      />
    </section>
  );
}