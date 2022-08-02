import { Text } from "@mantine/core";

interface WelcomeProps {
  button?: JSX.Element;
}

export function Welcome(props: WelcomeProps):JSX.Element {
  return (
    <div>
      <Text style={{fontSize: 40}}>Hello & Welcome to Valist 🎉</Text>
      <Text style={{fontSize: 16, maxWidth: 600}}>Valist is a web3-native software marketplace where you can find, publish and share apps, games, and more. </Text>
      <br/>
      <Text style={{fontSize: 16, maxWidth: 600}}>Connect your wallet and create an account to get started!</Text>
      <video style={{width: 600, margin: '40px 0', display: 'block'}} autoPlay loop controls={false}>
        <source src="/images/party.webm" type="video/webm" />
      </video> 
      {props.button}
    </div>
  );
}