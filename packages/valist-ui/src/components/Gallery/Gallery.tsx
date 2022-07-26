import { Fragment, useEffect, useState } from "react";

export type Asset= {
  name: string,
  src: string,
  type: string,
}

interface GalleryProps {
  assets: Asset[],
}

export const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;

export const getYouTubeID = (url: string) => {
  const res = url.match(youtubeRegex);
  return res && res.length > 0 ? res[1] : null;
};

export const getYouTubeEmbedURL = (ytID: string) => {
  return `https://youtube.com/embed/${ytID}`;
};

export function Gallery(props: GalleryProps):JSX.Element {
  const [currentAsset, setCurrentAsset] = useState<Asset| null>(null);

  useEffect(() => {
    if (props?.assets?.length !== 0) {
      setCurrentAsset(props?.assets[0]);
    } else {
      setCurrentAsset(null);
    }
  }, [props?.assets]);

  const renderElement = () => {
    if (currentAsset?.type.includes('image')) {
      return (
        <img 
          key={currentAsset.name} 
          src={currentAsset.src}
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', margin: '0 auto'}}  
          alt={currentAsset.name} 
        />
      );
    } else if (currentAsset?.type.includes('video')) {
      return (
        <video controls style={{ maxWidth: '100%', maxHeight: '100%' }}>
          <source src={currentAsset.src} type={currentAsset.type} />
        </video>
      );
    } else if (currentAsset?.type.includes('youtube')) {
      return (
        <iframe
          width="100%"
          src={getYouTubeEmbedURL(getYouTubeID(currentAsset.src) || '')} 
          title="YouTube video player"
          frameBorder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen>
        </iframe>
      );
    }
    return <div style={{ height: '450px', width: "850" }} ></div>;
  };
 
  return (
    <div>
      <div style={{ height: '450px', display: 'flex', backgroundColor: 'black', overflow: 'hidden'}}>
        {renderElement()}
      </div>
      <div style={{display: 'flex', backgroundColor: '#171616', overflowX: 'auto', height: 80}}>
        {props?.assets?.map((asset) => (
          <img 
            key={asset.name}
            style={{ maxWidth: '100%', maxHeight: '100%' }}
            onClick={() => setCurrentAsset(asset)}
            src={((asset?.type.includes('video') || asset?.type.includes('youtube')) && '/images/play-video.png/') ||  asset.src} 
            alt={`${asset.name}-preview`}
          />
        ))}
      </div>
    </div>
  );
}