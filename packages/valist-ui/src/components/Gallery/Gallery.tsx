import { useEffect, useState } from 'react';
import useStyles from './Gallery.styles';

export type Asset = {
  name: string,
  src: string,
  type: string,
}

export interface GalleryProps {
  assets: Asset[],
};

const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

const getYouTubeEmbedURL = (url: string) => {
  const res = url.match(youtubeRegex);
  return `https://youtube.com/embed/${res?.[1]}`;
};

const getThumbSrc = (asset: Asset) => {
  if (asset.type.includes('youtube') || asset.type.includes('video')) {
    return '/images/play-video.png/';
  }
  return asset.src;
};

export function Gallery(props: GalleryProps):JSX.Element {
  const { classes } = useStyles();
  const [currentAsset, setCurrentAsset] = useState<Asset| null>(null);

  useEffect(() => {
    setCurrentAsset(props?.assets?.[0]);
  }, [props?.assets]);
 
  return (
    <div>
      <div className={classes.preview}>
        { currentAsset?.type.includes('image') &&
          <img 
            src={currentAsset.src}
            className={classes.image}
            alt={currentAsset.name} 
          />
        }
        { currentAsset?.type.includes('video') &&
          <video controls className={classes.video}>
            <source src={currentAsset.src} type={currentAsset.type} />
          </video>
        }
        { currentAsset?.type.includes('youtube') &&
          <iframe
            width="100%"
            src={getYouTubeEmbedURL(currentAsset.src)}
            title="YouTube video player"
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
          />
        }
      </div>
      <div className={classes.items}>
        {props?.assets?.map((asset, index) => (
          <img 
            key={asset.name + String(index)}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={() => setCurrentAsset(asset)}
            src={getThumbSrc(asset)} 
            alt={`${asset.name}-preview`}
          />
        ))}
      </div>
    </div>
  );
}