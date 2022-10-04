import { Image, Text } from "@mantine/core";
import useStyles from './Welcome.styles';

interface WelcomeProps {
  button?: JSX.Element;
}

export function Welcome(props: WelcomeProps):JSX.Element {
  const { classes } = useStyles();

  return (
    <div>
      <Text style={{fontSize: 40}}>Hello & Welcome to Valist 🎉</Text>
      <Text style={{fontSize: 16, maxWidth: 600}}>Valist is a web3-native software marketplace where you can find, publish and share apps, games, and more. </Text>
      <br/>
      <Text style={{fontSize: 16, maxWidth: 600}}>Connect your wallet and create an account to get started!</Text>
      <Image className={classes.img} src="/images/party.gif" />
      {props.button}
    </div>
  );
}