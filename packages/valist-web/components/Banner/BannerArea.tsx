import { useLocalStorage } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { DeployBanner } from './DeployBanner';
import { MessageBanner } from './MessageBanner';
import { WrappedBanner } from './WrappedBanner';

export type BannerType = 'deploy' | 'message' | 'wrapped';

export interface BannerProps {
  banners: BannerType[];
  actions?: {
    deploy?: () => void;
    wrapped?: () => void;
  }
}

export function BannerArea(props: BannerProps) {
  const [closedBanners, setClosedBanners] = useLocalStorage<BannerType[]>({
    key: 'closedBanners',
  });

  const [bannersState, setBannersState] = useState<Record<string, boolean>>({
    'deploy': false,
    'message': false,
    'wrapped': false,
  });

  const [currentBanner, setCurrentBanner] = useState<string>('');
  const [dismissed, setDismissed] = useState<boolean>(false);

  const setClosed = (banner: string) => {
    setClosedBanners({
      ...closedBanners,
      [banner]: true,
    });
    setDismissed(true);
  };

  useEffect(() => {
    const { ...banners } = bannersState;

    for (const banner of props.banners) {
      banners[banner] = (props.banners.includes(banner) && !(closedBanners && closedBanners?.includes(banner)));
    }

    const bannerKeys:string[] = [];
    Object.entries(banners).forEach(([key, value]) => {
      if (value) bannerKeys.push(key);
    });
    
    const randomKey = bannerKeys[Math.floor(Math.random() * bannerKeys.length)];

    setCurrentBanner(randomKey);
    setBannersState(banners);
  }, []);

  const renderBanner = () => {
    if (bannersState['message']) return <MessageBanner onClose={() => setClosed('message')}/>;
    if (currentBanner === 'deploy' && props?.actions?.deploy) return <DeployBanner onClick={props?.actions?.deploy} onClose={() => setClosed('deploy')} />;
    if (currentBanner === 'wrapped' && props?.actions?.wrapped) return  <WrappedBanner onClick={props?.actions?.wrapped} onClose={() => setClosed('wrapped')}/>;
  };

  return (
    <div>
      {!dismissed && renderBanner()}
    </div>
  );
}