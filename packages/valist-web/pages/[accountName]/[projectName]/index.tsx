import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../../components/Layouts/Main";
import { BigNumber, BigNumberish, ethers } from "ethers";
import ProjectActions from "../../../features/projects/ProjectActions";
import { PROJECT_PROFILE_QUERY } from "../../../utils/Apollo/queries";
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

export default function ProjectPage():JSX.Element {
  const { publicRuntimeConfig } = getConfig();
  const router = useRouter();
  const accountName = `${router.query.accountName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const accounts = useAppSelector(selectAccounts);
  const address = useAppSelector(selectAddress);
  const [projectID, setProjectID] = useState<string>('');
  const { data, loading, error } = useQuery(PROJECT_PROFILE_QUERY, {
    variables: { projectID: projectID },
  });
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

  useEffect(() => {
    const chainID = BigNumber.from(publicRuntimeConfig.CHAIN_ID);
    const accountID = generateID(chainID, accountName);
    const projectID = generateID(accountID, projectName);
    setProjectID(projectID.toString());
  }, [publicRuntimeConfig.CHAIN_ID]);

  useEffect(() => {
    const fetchReleaseMeta = async (release: Release) => {
      try {
        if (release?.metaURI && release?.metaURI !== '') {
          const metaJson = await fetch(release.metaURI).then(res => res.json());

          setReleaseMeta(metaJson);
        }
      } catch(err) {
        notify('error', "Failed to fetch release metadata.");
        console.log("Failed to fetch release metadata.", err);
      }
    };
  
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await fetch(metaURI).then(res => res.json());
        setProjectMeta(projectJson);
      } catch(err) {
        notify('error', "Failed to fetch project metadata.");
        console.log("Failed to fetch project metadata.", err);
      }
    };

    if (data?.projects[0]) {
      setMembers(data?.projects[0]?.members);
      setReleases(data?.projects[0]?.releases);
      setVersion(data?.projects[0]?.releases[0]?.name);
      setLogs(data?.projects[0]?.logs);
      fetchReleaseMeta(data?.projects[0]?.releases[0]);

      if (data?.projects[0]?.metaURI !== '') {
        fetchProjectMeta(data?.projects[0]?.metaURI);
      }
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      if (valistCtx && projectID) {
        const price = await valistCtx.getProductPrice(projectID);
        setLicensePrice(ethers.utils.formatEther(price));

        let balance = await valistCtx.getProductBalance(address, projectID);
        setLicenseBalance(Number(balance));
      }
    })();
  }, [address, projectID, valistCtx]);

  useEffect(() => {
    if (accountName && projectName) {
       const profileAccount = accounts[accountName];
       
       if (profileAccount) {
        profileAccount.map((project) => {
           if (project.name === projectName) setIsMember(true);
        });
       }
    }
  }, [accounts, projectName, accountName]);

  const mintLicense = async () => {
    if ( valistCtx && projectID && address !== '0x0') {
      let toastID = '';
      try {
        const transaction = await valistCtx.purchaseProduct(
          projectID,
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
    <Layout title="Valist | Project">
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