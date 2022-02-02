import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import getConfig from "next/config";
import Layout from "../../../components/Layouts/Main";
import ProjectContent from "../../../components/Projects/ProjectContent";
import ProjectMetaCard from "../../../components/Projects/ProjectMetaCard";
import ProjectProfileCard from "../../../components/Projects/ProjectProfileCard";
import { PROJECT_PROFILE_QUERY } from "../../../utils/Apollo/queries";
import { Member, Release } from "../../../utils/Apollo/types";
import { parseCID } from "../../../utils/Ipfs";
import ValistContext from "../../../components/Valist/ValistContext";
import { ProjectMeta, ReleaseMeta } from "../../../utils/Valist/types";

export default function ProjectPage():JSX.Element {
  const router = useRouter();
  const { publicRuntimeConfig } = getConfig();
  const teamName = `${router.query.teamName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const [projectID, setProjectID] = useState<string>('');
  const [version, setVersion] = useState<string>('');
  const { data, loading, error } = useQuery(PROJECT_PROFILE_QUERY, {
    variables: { project: projectID },
  });
  const [view, setView] = useState<string>('Readme');
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>({
    image: '',
    name: 'loading',
    description: 'loading',
    external_url: '',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [releaseMeta, setReleaseMeta] = useState<ReleaseMeta>({
    image: '/images/ValistLogo128.png',
    name: 'loading',
    description: '# Readme Not Found',
    external_url: '',
    artifacts: {
      loading: {
        sha256: 'loading',
        provider: 'loading',
      },
    },
  });

  const fetchReleaseMeta = async (release: Release) => {
    if (release && release.metaURI !== '') {
      const parsedCID = parseCID(release.metaURI);
      const requestURL = `${publicRuntimeConfig.IPFS_GATEWAY}/ipfs/${parsedCID}`;
      try {
        const req = await fetch(requestURL);
        const metaJson: ReleaseMeta = await req.json();
        if (Object.keys(metaJson.artifacts).length === 0) {
          metaJson.artifacts.artifact = {
            sha256: '',
            provider: release.metaURI,
          };
        }
        setReleaseMeta(metaJson);
      } catch (e) { /* TODO Handle */ }
    }
  };

  const fetchProjectMeta = async (metaCID: string) => {
    const parsedCID = parseCID(metaCID);
    const requestURL = `${publicRuntimeConfig.IPFS_GATEWAY}/ipfs/${parsedCID}`;
    try {
      const req = await fetch(requestURL);
      const metaJson:ProjectMeta = await req.json();
      setProjectMeta(metaJson);
    } catch (e) { /* TODO Handle */ }
  };

  useEffect(() => {
    (async () => {
      const valist = valistCtx.valist;
      if (teamName !== 'undefined') {
        const teamID = await valist.contract.getTeamID(teamName);
        const _projectID = await valist.contract.getProjectID(teamID, projectName);
        setProjectID(_projectID._hex);
      }
    })();

    if (data && data.projects && data.projects[0] && 
      data.projects[0].members && data.projects[0].releases &&
      data.projects[0].releases[0]
    ) {
      setMembers(data.projects[0].members);
      setReleases(data.projects[0].releases);
      setVersion(data.projects[0].releases[0].name);
      fetchReleaseMeta(data.projects[0].releases[0]);
      fetchProjectMeta(data.projects[0].metaURI);
    }
  }, [data, teamName, valistCtx]);

  return (
    <Layout title="Valist | Project">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <ProjectProfileCard
            view={view}
            setView={setView}
            teamName={teamName}
            projectName={projectName} 
            projectImg={
              (releaseMeta.image === '') ? '/images/ValistLogo128.png' : `${publicRuntimeConfig.IPFS_GATEWAY}/ipfs/${parseCID(releaseMeta.image)}`
            }
          />
          <ProjectContent
            projectName={projectName}
            projectReleases={releases}
            releaseMeta={releaseMeta}
            view={view}
            teamName={teamName}
            members={members} />
        </div>
        <div className="grid grid-cols-1 gap-4 lg:col-span-2">
          <ProjectMetaCard
            version={version} 
            teamName={teamName}
            projectName={projectName} 
            projectMeta={projectMeta} 
            releaseMeta={releaseMeta} 
          />
        </div>
      </div>
    </Layout>
  )
}