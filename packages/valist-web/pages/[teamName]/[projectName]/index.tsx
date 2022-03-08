import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import Layout from "../../../components/Layouts/Main";
import ProjectContent from "../../../components/Projects/ProjectContent";
import ProjectMetaCard from "../../../components/Projects/ProjectMetaCard";
import ProjectProfileCard from "../../../components/Projects/ProjectProfileCard";
import { PROJECT_PROFILE_QUERY } from "../../../utils/Apollo/queries";
import { Member, Release } from "../../../utils/Apollo/types";
import ValistContext from "../../../components/Valist/ValistContext";
import { ProjectMeta, ReleaseMeta } from "../../../utils/Valist/types";
import LogCard from '../../../components/Logs/LogCard';
import AccountContext from "../../../components/Accounts/AccountContext";
import ProjectActions from '../../../components/Projects/ProjectActions';
import { BigNumberish, ethers } from "ethers";
import parseError from "../../../utils/Errors";

export default function ProjectPage():JSX.Element {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const accountCtx = useContext(AccountContext);
  const [projectID, setProjectID] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const { data, loading, error } = useQuery(PROJECT_PROFILE_QUERY, {
    variables: { project: projectID },
  });
  const [view, setView] = useState<string>('Readme');
  const [licensePrice, setLicensePrice] = useState<BigNumberish | null>(null);
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>({
    image: '',
    name: 'loading',
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

  useEffect(() => {
    const getProjectID = async () => {
      if (teamName !== 'undefined') {
        try {
          const teamID = await valistCtx.contract.getTeamID(teamName);
          const _projectID = await valistCtx.contract.getProjectID(teamID, projectName);
          setProjectID(_projectID.toHexString());
        } catch(err) {
          // accountCtx.notify('error', String(err));
          console.log("Failed to fetch projectID.", err);
        }
      }
    };

    getProjectID();
  }, [valistCtx, teamName, projectName, accountCtx]);

  useEffect(() => {
    const fetchReleaseMeta = async (release: Release) => {
      try {
        if (release?.metaURI && release?.metaURI !== '') {
          const metaJson = await fetch(release.metaURI).then(res => res.json());

          setReleaseMeta(metaJson);
        }
      } catch(err) {
        accountCtx.notify('error', String(err));
        console.log("Failed to fetch release metadata.", err);
      }
    };
  
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await fetch(metaURI).then(res => res.json());
        setProjectMeta(projectJson);
      } catch(err) {
        accountCtx.notify('error', String(err));
        console.log("Failed to fetch project metadata.", err);
      }
    };

    if (data?.projects[0]) {
      setMembers(data?.projects[0]?.members);
      setReleases(data?.projects[0]?.releases);
      setVersion(data?.projects[0]?.releases[0]?.name);
      fetchReleaseMeta(data?.projects[0]?.releases[0]);

      if (data?.projects[0]?.metaURI !== '') {
        fetchProjectMeta(data?.projects[0]?.metaURI);
      }
    }
  }, [accountCtx, data]);

  useEffect(() => {
    (async () => {
      if (releaseMeta.licenses && releaseMeta.licenses[0]) {
        const licenseName = releaseMeta.licenses[0];
        const licenseID = await valistCtx.contract.getLicenseID(projectID, licenseName);
        const price = await valistCtx.contract.getPriceByID(licenseID);
        setLicensePrice(ethers.utils.formatEther(price));

        // @ts-ignore @TODO expose from SDK interface
        let balance = await valistCtx.contract.license.balanceOf(
          accountCtx.address, licenseID,
        );

        setLicenseBalance(Number(balance));
      }
    })();
  }, [accountCtx.address, projectID, releaseMeta.licenses, valistCtx.contract]);

  const mintLicense = async () => {
    if (releaseMeta.licenses && releaseMeta.licenses[0] && accountCtx.address !== '0x0') {
      let toastID = '';
      try {
        const transaction = await valistCtx.mintLicense(
          teamName,
          projectName,
          releaseMeta.licenses[0],
          accountCtx.address,
        );
        toastID = accountCtx.notify('transaction', transaction.hash());
        await transaction.wait();
        accountCtx.dismiss(toastID);
        accountCtx.notify('success');
      } catch (err: any) {
        accountCtx.dismiss(toastID);
        accountCtx.notify('error', parseError(err));
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
            tabs={['Readme', 'Versions', 'Activity', 'Members']}
            teamName={teamName}
            projectName={projectName} 
            projectImg={projectMeta.image ? projectMeta.image : '' }
          />
          <ProjectContent
            projectName={projectName}
            projectReleases={releases}
            projectMeta={projectMeta}
            releaseMeta={releaseMeta}
            view={view}
            teamName={teamName}
            members={members} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <ProjectActions
            teamName={teamName}
            projectName={projectName}
            showAll={false}
            releases={releases}
            releaseMeta={releaseMeta}
            licensePrice={licensePrice}
            mintLicense={mintLicense} 
            licenseBalance={licenseBalance}         
          />
          <ProjectMetaCard
            version={version} 
            teamName={teamName}
            donate={accountCtx?.setModal}
            memberCount={members.length}
            projectName={projectName} 
            projectMeta={projectMeta} 
            releaseMeta={releaseMeta} 
          />
          <LogCard team={teamName} project={projectName} />
        </div>
      </div>
    </Layout>
  );
}