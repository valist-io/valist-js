import { Text } from "@mantine/core";

interface WelcomeProps {
  button?: JSX.Element;
}

export function Welcome(props: WelcomeProps):JSX.Element {
  return (
    <div>
      <Text style={{fontSize: 40}}>Hello & Welcome To Valist 🎉</Text>
      <Text style={{fontSize: 16, maxWidth: 600}}>If you already have an account please connect your wallet, if you are new, get ready to publish your Project / Software in a truly decentralized way within a few clicks.</Text>
      <video style={{width: 600, margin: '40px 0', display: 'block'}} autoPlay loop controls={false}>
        <source src="/images/party.webm" type="video/webm" />
      </video> 
      {props.button}
    </div>
  );
}