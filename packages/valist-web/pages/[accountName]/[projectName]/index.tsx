import { useQuery,gql } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../../components/Layouts/Project";
import { BigNumber, ethers } from "ethers";
import ProjectActions from "../../../features/projects/ProjectActions";
import { PROJECT_PROFILE_QUERY } from "@valist/sdk/dist/graphql";
import { Log, Member, Release } from "../../../utils/Apollo/types";
import { ProjectMeta, ReleaseMeta } from "../../../utils/Valist/types";
import parseError from "../../../utils/Errors";
import LogCard from "../../../features/logs/LogCard";
import { dismiss, notify } from "../../../utils/Notifications";
import ValistContext from "../../../features/valist/ValistContext";
import { useAppSelector } from "../../../app/hooks";
import { selectAccounts, selectAddress } from "../../../features/accounts/accountsSlice";
import ProjectProfileCard from "../../../features/projects/ProjectProfileCard";
import ProjectMetaCard from "../../../features/projects/ProjectMetaCard";
import ProjectContent from "../../../features/projects/ProjectProfileContent";
import ProjectProfileCardActions from "../../../features/projects/ProjectProfileCardActions";
import getConfig from "next/config";
import { generateID } from "@valist/sdk";
import client from "@/utils/Apollo/client";

export const getServerSideProps = async ({ params }: any) => {
  const { publicRuntimeConfig } = getConfig();

  const chainID = BigNumber.from(publicRuntimeConfig.CHAIN_ID);
  const accountID = generateID(chainID, params.accountName);
  const projectID = generateID(accountID, params.projectName);

  const { data } = await client.query({
    query: gql(PROJECT_PROFILE_QUERY),
    variables: { projectID: projectID },
  });

  let projectMeta;
  try {
    if (data?.projects[0]?.metaURI !== '') {
      projectMeta = await fetch(data?.projects[0]?.metaURI).then(res => res.json());
    }
  } catch(err) {
    console.log("Failed to fetch project metadata.", err);
  }

  let releaseMeta;
  try {
    if (data?.projects[0]?.releases[0] && data?.projects[0]?.releases[0]?.metaURI !== '') {
      releaseMeta = await fetch(data?.projects[0]?.releases[0]?.metaURI).then(res => res.json());
    }

  } catch(err) {
    console.log("Failed to fetch release metadata.", err);
  }

  return {
    props: {
      data,
      projectID,
      accountName: params.accountName,
      projectName: params.projectName,
      projectMeta,
      releaseMeta,
    },
  };
};

export default function ProjectPage(props: any):JSX.Element {
  const router = useRouter();
  const accountName = `${router.query.accountName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const accounts = useAppSelector(selectAccounts);
  const address = useAppSelector(selectAddress);
  const [version, setVersion] = useState<string>('');
  const [view, setView] = useState<string>('Readme');
  const [licensePrice, setLicensePrice] = useState<string>('0');
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>({
    image: '',
    name: '',
    description: '# Not Found',
    external_url: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [releaseMeta, setReleaseMeta] = useState<ReleaseMeta>({
    image: '',
    name: 'loading',
    description: '# Readme Not Found',
    external_url: '',
  });
  const [licenseBalance, setLicenseBalance] = useState<Number>(0);
  const tabs = [
    {
      text: 'Readme',
      disabled: false,
    },
    {
      text: 'Versions',
      disabled: false,
    },
    {
      text: 'Activity',
      disabled: false,
    },
    {
      text: 'Members',
      disabled: false,
    },
  ];
  const [isMember, setIsMember] = useState(false);
  const [logs, setLogs] = useState<Log[]>([]);

  console.log('props.data', props);

  useEffect(() => {
    if (props.data?.projects[0]) {
      setMembers(props.data?.projects[0]?.members);
      setReleases(props.data?.projects[0]?.releases);
      setVersion(props.data?.projects[0]?.releases[0]?.name);
      setLogs(props.data?.projects[0]?.logs);
      
      setProjectMeta(props.projectMeta);
      setReleaseMeta(props.releaseMeta);
    }
  }, [props.data, props.projectMeta, props.releaseMeta]);

  useEffect(() => {
    (async () => {
      if (valistCtx && props.projectID) {
        const price = await valistCtx.getProductPrice(props.projectID);
        setLicensePrice(ethers.utils.formatEther(price));

        if (address !== '0x0') {
          let balance = await valistCtx.getProductBalance(address, props.projectID);
          setLicenseBalance(Number(balance));
        }
      }
    })();
  }, [address, props.projectID, valistCtx]);

  useEffect(() => {
    if (accountName && projectName) {
       const profileAccount = accounts[accountName];
       
       if (profileAccount) {
        profileAccount.map((project: { name: string; }) => {
           if (project.name === projectName) setIsMember(true);
        });
       }
    }
  }, [accounts, projectName, accountName]);

  const mintLicense = async () => {
    if ( valistCtx && props.projectID && address !== '0x0') {
      let toastID = '';
      try {
        const transaction = await valistCtx.purchaseProduct(
          props.projectID,
          address,
        );
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
        dismiss(toastID);
        notify('success');
      } catch (err: any) {
        dismiss(toastID);
        notify('error', parseError(err));
      }
    }
  };
 
  return (
    <Layout title="Valist | Project" description={projectMeta.description || ''} graphic={projectMeta.image || ""} url={`valist.io/${props.accountName}/${props.projectName}`}>
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <ProjectProfileCard
            view={view}
            setView={setView}
            tabs={tabs}
            teamName={accountName}
            projectName={projectMeta?.name || projectName} 
            projectImg={projectMeta.image ? projectMeta.image : '' }
          />
          <ProjectContent
            projectName={projectName}
            projectReleases={releases}
            projectMeta={projectMeta}
            releaseMeta={releaseMeta}
            view={view}
            teamName={accountName}
            members={members}
            logs={logs}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <ProjectActions
            teamName={accountName}
            projectName={projectName}
            showAll={false}
            releases={releases}
            releaseMeta={releaseMeta}
            licensePrice={licensePrice}
            mintLicense={mintLicense} 
            licenseBalance={licenseBalance}         
          />
          {isMember && <ProjectProfileCardActions accountName={accountName} projectName={projectName} />}
          <ProjectMetaCard
            version={version}
            teamName={accountName}
            donate={() => {}}
            memberCount={members.length}
            projectName={projectName} 
            projectMeta={projectMeta}
          />
          <LogCard logs={logs} />
        </div>
      </div>
    </Layout>
  );
}