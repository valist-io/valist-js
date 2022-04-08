/* eslint-disable @next/next/no-img-element */

import { Fragment, useState } from "react";

export type Asset= {
  name: string,
  src: string,
  type: string,
  preview?: string,
}

interface ProjectGalleryProps {
  assets: Asset[],
}

export default function ProjectGallery(props: ProjectGalleryProps):JSX.Element {
  const [currentAsset, setCurrentAsset] = useState<Asset>(props?.assets[0]);

  const renderElement = () => {
    if (currentAsset?.type.includes('image')) {
      return (
        <img 
          key={currentAsset.name} 
          src={currentAsset.src}
          className="mx-auto"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}  
          alt={currentAsset.name} 
        />
      );
    } else if (currentAsset?.type.includes('video')) {
      return (
        <video controls autoPlay style={{ maxWidth: '100%', maxHeight: '100%' }}>
          <source src={currentAsset.src} type={currentAsset.type} />
        </video>
      );
    }
    return <div style={{ height: '450px', width: "850" }} ></div>;
  };
 
  return (
    <div>
      <div style={{ height: '450px' }} className="flex bg-black overflow-hidden">
        {renderElement()}
      </div>
      <div className="flex bg-neutral-900 overflow-x-auto h-20">
        {props.assets.map((asset) => (
          <Fragment key={asset.name}>
            <img 
              style={{ maxWidth: '100%', maxHeight: '100%' }}
              onClick={() => setCurrentAsset(asset)}
              src={asset.preview || asset.src} 
              alt={asset.name} 
            />
          </Fragment>
        ))}
      </div>
    </div>
  );
}