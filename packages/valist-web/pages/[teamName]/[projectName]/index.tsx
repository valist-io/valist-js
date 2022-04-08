import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Layout from "../../../components/Layouts/Main";
import { BigNumberish, ethers } from "ethers";
import ProjectActions from "../../../features/projects/ProjectActions";
import { PROJECT_PROFILE_QUERY } from "../../../utils/Apollo/queries";
import { Member, Release } from "../../../utils/Apollo/types";
import { ProjectMeta, ReleaseMeta } from "../../../utils/Valist/types";
import parseError from "../../../utils/Errors";
import LogCard from "../../../features/logs/LogCard";
import { getProjectID } from "../../../utils/Valist";
import { dismiss, notify } from "../../../utils/Notifications";
import ValistContext from "../../../features/valist/ValistContext";
import { useAppSelector } from "../../../app/hooks";
import { selectAddress } from "../../../features/accounts/accountsSlice";
import ProjectProfileCard from "../../../features/projects/ProjectProfileCard";
import ProjectMetaCard from "../../../features/projects/ProjectMetaCard";
import ProjectContent from "../../../features/projects/ProjectProfileContent";
import ProjectProfileCardActions from "../../../features/projects/ProjectProfileCardActions";

export default function ProjectPage():JSX.Element {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const address = useAppSelector(selectAddress);
  const dispatch = useDispatch();
  const [projectID, setProjectID] = useState<string>('');
  const { data, loading, error } = useQuery(PROJECT_PROFILE_QUERY, {
    variables: { project: projectID },
  });
  const [version, setVersion] = useState<string>('');
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

  useEffect(() => {
    const _getProjectID = async () => {
      if (teamName !== 'undefined') {
        try {
          const _projectID = getProjectID(teamName, projectName);
          setProjectID(_projectID);
        } catch(err) {
          notify('error', String(err));
          console.log("Failed to fetch projectID.", err);
        }
      }
    };
    _getProjectID();
  }, [teamName, projectName]);

  useEffect(() => {
    const fetchReleaseMeta = async (release: Release) => {
      try {
        if (release?.metaURI && release?.metaURI !== '') {
          const metaJson = await fetch(release.metaURI).then(res => res.json());

          setReleaseMeta(metaJson);
        }
      } catch(err) {
        notify('error', String(err));
        console.log("Failed to fetch release metadata.", err);
      }
    };
  
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await fetch(metaURI).then(res => res.json());
        setProjectMeta(projectJson);
      } catch(err) {
        notify('error', String(err));
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
  }, [data]);

  useEffect(() => {
    (async () => {
      if (releaseMeta.licenses && releaseMeta.licenses[0]) {
        const licenseName = releaseMeta.licenses[0];
        const licenseID = await valistCtx.contract.getLicenseID(projectID, licenseName);
        const price = await valistCtx.contract.getPriceByID(licenseID);
        setLicensePrice(ethers.utils.formatEther(price));

        // @ts-ignore @TODO expose from SDK interface
        let balance = await valistCtx.contract.license.balanceOf(
          address, licenseID,
        );

        setLicenseBalance(Number(balance));
      }
    })();
  }, [address, projectID, releaseMeta.licenses, valistCtx.contract]);

  const mintLicense = async () => {
    if (releaseMeta.licenses && releaseMeta.licenses[0] && address !== '0x0') {
      let toastID = '';
      try {
        const transaction = await valistCtx.mintLicense(
          teamName,
          projectName,
          releaseMeta.licenses[0],
          address,
        );
        toastID = notify('transaction', transaction.hash());
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
          <ProjectProfileCardActions accountName={teamName} projectName={projectName} />
          <ProjectMetaCard
            version={version} 
            teamName={teamName}
            donate={() => {}}
            memberCount={members.length}
            projectName={projectName} 
            projectMeta={projectMeta}
          />
          <LogCard team={teamName} project={projectName} />
        </div>
      </div>
    </Layout>
  );
}