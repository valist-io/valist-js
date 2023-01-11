import { Text, Title, Grid, Button } from "@mantine/core";
import Image from"next/image";
import { X } from "tabler-icons-react";

interface WrappedBannerProps {
  onClose: () => void;
  onClick: () => void;
}

export function WrappedBanner(props: WrappedBannerProps):JSX.Element {
  return (
    <div style={{ backgroundColor: '#EAF4FF', borderRadius: 16, marginBottom: 24, padding: 0, position: 'relative' }}>
      <X 
        size={28}
        style={{ position: 'absolute', right : 10, top: 10, zIndex: 200 }}
        onClick={props.onClose}
      />
      <Grid>
        <Grid.Col span={8}>
          <div style={{ padding: 32 }}>
            <Title size="md" style={{ color: '#030111' }}>
            Sneak peak at your 2022 👀
            </Title>
            <Text size="sm" style={{ color: '#9B9BB1', fontWeight: 400, fontSize: 14, marginTop: 8, marginBottom: 24, maxWidth: 600 }}>
              Take a glimpse of your top 2022 journey with Valist, you have had an amazing year, why not take a sip of coffee, relax your back and lets show you your report
            </Text>
            <Button 
              style={{ backgroundColor: '#2E90FA', padding: '12px 16px' }}
              onClick={props.onClick}
            >
              Unwrap Report
            </Button>
          </div>
        </Grid.Col>
        <Grid.Col span={4}>
          <Image width={443} height={200} style={{}} alt="banner-image" src={'/images/banners/target.png'} />
        </Grid.Col>
      </Grid>
    </div>
  );
}