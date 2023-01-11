import { Text, Title, Grid, Button } from "@mantine/core";
import Image from"next/image";
import { X } from 'tabler-icons-react';

interface DeploymentBannerProps {
  onClose: () => void;
  onClick: () => void;
}

export function DeployBanner(props: DeploymentBannerProps):JSX.Element {
  return (
    <div style={{ backgroundColor: '#FEF4E6', borderRadius: 16, marginBottom: 24, position: 'relative' }}>
      <X 
        size={28}
        style={{ position: 'absolute', right : 10, top: 10, zIndex: 200 }}
        onClick={props.onClose}
      />
      <Grid>
        <Grid.Col span={8}>
          <div style={{ padding: 32 }}>
            <Title size="md" style={{ color: '#030111' }}>
              One-Click Deployment
            </Title>
            <Text size="sm" style={{ color: '#9B9BB1', fontWeight: 400, fontSize: 14, marginTop: 8, marginBottom: 24, maxWidth: 650 }}>
              Say good bye to complicated file uploads to set up your project. Configure automatic deployments, continuous integration, and source control in one click, all we need is you to connect to your Github
            </Text>
            <Button 
              style={{ backgroundColor: '#F79009', padding: '12px 16px' }}>
                Get started
            </Button>
          </div>
        </Grid.Col>
        <Grid.Col span={4}>
          <Image width={443} height={200} style={{}} alt="banner-image" src={'/images/banners/rocket.png'} />
        </Grid.Col>
      </Grid>
    </div>
  );
}