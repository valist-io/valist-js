import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { generateID } from "@valist/sdk";
import getConfig from "next/config";
import ValistContext from "../../../../features/valist/ValistContext";

export default function ProjectPage(): JSX.Element {
  const valistCtx = useContext(ValistContext);
  const [src, setSrc] = useState('');

  const router = useRouter();
  const accountName = `${router.query.teamName}`;
  const projectName = `${router.query.projectName}`;
  const releaseName = `${router.query.releaseName}`;

  const { publicRuntimeConfig } = getConfig();
  const chainID = publicRuntimeConfig.CHAIN_ID;
  const accountID = generateID(chainID, accountName);
  const projectID = generateID(accountID, projectName);
  const releaseID = generateID(projectID, releaseName);

  useEffect(() => {
    if (valistCtx) {
      valistCtx.getReleaseMeta(releaseID).then(meta => setSrc(meta.external_url));
    }
  }, [valistCtx, releaseID, setSrc]);

  return (
    <div style={{height: '100vh', width: '100vw', paddingTop: '25px'}}>
      <div style={{height: '25px', marginTop: '-25px'}}>
        <span>Return to Valist</span>
      </div>
      <iframe width="100%" height="100%" src={src}></iframe>
    </div>
  );
}