import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { HeartIcon, MailIcon, StarIcon } from '@heroicons/react/solid';
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
  const [isFavorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    const getProjectID = async () => {
      if (teamName !== 'undefined') {
        try {
          const teamID = await valistCtx.valist.contract.getTeamID(teamName);
          const _projectID = await valistCtx.valist.contract.getProjectID(teamID, projectName);
          setProjectID(_projectID._hex);
        } catch(err) {
          // accountCtx.notify('error', String(err));
          // console.log("Failed to fetch projectID.", err);
        }
      }
    };

    getProjectID();
  }, [valistCtx, teamName, projectName, accountCtx]);

  useEffect(() => {
    const fetchReleaseMeta = async (release: Release) => {
      try { 
        if (release?.metaURI && release?.metaURI !== '') {
          const metaJson = await valistCtx.valist.storage.readReleaseMeta(release.metaURI);
          if (metaJson?.artifacts?.size === 0) {
            metaJson.artifacts.set('Unknown', {
                architecture: "Unknown",
                sha256: '',
                provider: release.metaURI,
            });
          }
          setReleaseMeta(metaJson);
        }
      } catch(err) {
        accountCtx.notify('error', String(err));
        console.log("Failed to fetch release metadata.", err);
      }
    };
  
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await valistCtx.valist.storage.readProjectMeta(metaURI);
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
  }, [accountCtx, data, valistCtx.valist.storage]);

  useEffect(() => {
    (async () => {
      if (releaseMeta.licenses && releaseMeta.licenses[0]) {
        const licenseName = releaseMeta.licenses[0];
        const licenseID = await valistCtx.valist.contract.getLicenseID(projectID, licenseName);
        const price = await valistCtx.valist.contract.getPriceByID(licenseID);
        setLicensePrice(ethers.utils.formatEther(price));


        // @ts-ignore @TODO expose from SDK interface
        let balance = await valistCtx.valist.contract.license.balanceOf(
          accountCtx.address, licenseID,
        );

        setLicenseBalance(Number(balance));
      }
    })();
  }, [accountCtx.address, projectID, releaseMeta.licenses, valistCtx.valist.contract]);

  useEffect(() => {
    if (teamName && projectName) {
       const favorited = window.localStorage.getItem(`${teamName}/${projectName}`);
       if (favorited) {
        setFavorite(true);
       }
    }
  }, [projectName, teamName]);

  const mintLicense = async () => {
    if (releaseMeta.licenses && releaseMeta.licenses[0] && accountCtx.address !== '0x0') {
      let toastID = '';
      try {
        const transaction = await valistCtx.valist.mintLicense(
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
        let errString;
        let text = '';

        if (err?.data?.message) {
          errString = err?.data.message;
        }


        if (err.message) {
          errString = err.message;
        }

        if (errString.includes('err: insufficient funds')) {
          text = 'Insufficient funds for transaction.';
        } else {
          text = errString;
        }
        accountCtx.notify('error', String(text));
      }
    }
  };

  const handleClickDonate = () => {
    console.log('modal', accountCtx.modal);
    accountCtx?.setModal(!accountCtx.modal);
  };

  const handleClickFavorite = () => {
    setFavorite(!isFavorite);
  };

  // console.log('beneficiary', releaseMeta);

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
            releaseMeta={releaseMeta}
            licensePrice={licensePrice}
            mintLicense={mintLicense} 
            licenseBalance={licenseBalance}         
          />
          <div className="bg-white rounded-md p-4">
            <div className="grid grid-cols-3 gap-3 space-between">
              <span className="w-full inline-flex rounded-md shadow-sm">
                <button onClick={async () => handleClickDonate()} type="button"
                  className="w-full justify-center align-center m-auto items-center py-2 px-4 border
                  border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
                  text-gray-500 hover:text-gray-400 focus:outline-none
                  focus:border-blue-300 focus:shadow-outline-blue transition
                  duration-150 ease-in-out" aria-label="Donate">
                    <HeartIcon className="h-10 w-10 block mx-auto" />
                    <p className="block">Donate</p>
                </button>
              </span>

              <span className="w-full inline-flex rounded-md shadow-sm">
                <button onClick={async () => window.location.href='mailto:contact@valist.io'} type="button"
                  className="w-full justify-center align-center m-auto items-center py-2 px-4 border
                  border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
                  text-gray-500 hover:text-gray-400 focus:outline-none
                  focus:border-blue-300 focus:shadow-outline-blue transition
                  duration-150 ease-in-out" aria-label="Feedback">
                    <MailIcon className="h-10 w-10 text-black-500 block mx-auto" />
                    <p className="block">Contact</p>
                </button>
              </span>

              <span className="w-full inline-flex rounded-md shadow-sm">
                <button onClick={async () => handleClickFavorite()} type="button"
                  className="w-full justify-center align-center m-auto items-center py-2 px-4 border
                  border-gray-300 rounded-md bg-white text-sm leading-5 font-medium
                  text-gray-500 hover:text-gray-400 focus:outline-none
                  focus:border-blue-300 focus:shadow-outline-blue transition
                  duration-150 ease-in-out" aria-label="Feedback">
                    <StarIcon className={`h-10 w-10 block mx-auto${isFavorite ? " text-amber-400" : ""}`} />
                    <p className="block">Favorite</p>
                </button>
              </span>
          </div>
          </div>
          <ProjectMetaCard
            version={version} 
            teamName={teamName}
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