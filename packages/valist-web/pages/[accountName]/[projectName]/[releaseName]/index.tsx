import Link from "next/link";
import getConfig from "next/config";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { generateID } from "@valist/sdk";
import ValistContext from "../../../../features/valist/ValistContext";

export default function ProjectPage(): JSX.Element {
  const valistCtx = useContext(ValistContext);
  const [src, setSrc] = useState('');

  const router = useRouter();
  const accountName = `${ router.query.accountName }`;
  const projectName = `${ router.query.projectName }`;
  const releaseName = `${ router.query.releaseName }`;

  const { publicRuntimeConfig } = getConfig();
  const chainID = publicRuntimeConfig.CHAIN_ID;
  const accountID = generateID(chainID, accountName);
  const projectID = generateID(accountID, projectName);
  const releaseID = generateID(projectID, releaseName);

  useEffect(() => {
    if (valistCtx) {
      valistCtx.getReleaseMeta(releaseID).then((meta: any) => setSrc(meta.external_url));
    }
  }, [valistCtx, releaseID, setSrc]);

  return (
    <div style={{ height: '100vh', width: '100vw', paddingTop: '25px' }}>
      <div style={{ height: '25px', marginTop: '-25px' }}>
        <Link href={`/${accountName}/${projectName}`}>
          <a>Return to Valist</a>
        </Link>
      </div>
      <iframe width="100%" height="100%" src={src}></iframe>
    </div>
  );
}