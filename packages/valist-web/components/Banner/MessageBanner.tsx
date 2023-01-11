import { Text, Title, Grid, Button } from "@mantine/core";
import Image from"next/image";
import { X } from "tabler-icons-react";

interface MessageBannerProps {
  onClose: () => void;
}

export function MessageBanner(props: MessageBannerProps):JSX.Element {
  return (
    <div style={{ backgroundColor: '#ffeaed', borderRadius: 16, marginBottom: 24 }}>
      <X 
        onClick={props.onClose}
        size={28} 
        style={{ position: 'absolute', right : 10, top: 10 }} 
      />
      <Grid>
        <Grid.Col span={8}>
          <div style={{ padding: 32 }}>
            <Title size="md" style={{ color: '#030111' }}>
              A message from Valist!
            </Title>
            <Text size="sm" style={{ color: '#9B9BB1', fontWeight: 400, fontSize: 14, marginTop: 8, marginBottom: 24, maxWidth: 600 }}>
              Valist is currently upgrading our IPFS gateway, this transition will be be completed by 5:00PM IST
            </Text>
            <Button style={{ backgroundColor: '#e01c12', padding: '12px 16px' }}>Close</Button>
          </div>
        </Grid.Col>
        <Grid.Col span={4}>
          <Image width={443} height={200} style={{}} alt="banner-image" src={'/images/banners/warning.png'} />
        </Grid.Col>
      </Grid>
    </div>
  );
}