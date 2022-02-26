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

export default function ProjectPage():JSX.Element {
  const router = useRouter();
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

  useEffect(() => {
    const getProjectID = async () => {
      if (teamName !== 'undefined') {
        try {
          const teamID = await valistCtx.valist.contract.getTeamID(teamName);
          const _projectID = await valistCtx.valist.contract.getProjectID(teamID, projectName);
          setProjectID(_projectID._hex);
        } catch(err) {
          /* @TODO HANDLE */
          console.log("Failed to fetch projectID.");
        }
      }
    };

    getProjectID();
  }, [valistCtx, teamName, projectName]);

  useEffect(() => {
    const fetchReleaseMeta = async (release: Release) => {
      try { 
        if (release?.metaURI !== '') {
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
        /* @TODO HANDLE */
        console.log("Failed to fetch release metadata.");
      }
    };
  
    const fetchProjectMeta = async (metaURI: string) => {
      try {
        const projectJson = await valistCtx.valist.storage.readProjectMeta(metaURI);
        setProjectMeta(projectJson);
      } catch(err) {
        /* @TODO HANDLE */
        console.log("Failed to fetch project metadata.");
      }
    };

    if (data?.projects[0]) {
      setMembers(data?.projects[0]?.members);
      setReleases(data?.projects[0]?.releases);
      setVersion(data?.projects[0]?.releases[0]?.name);
      fetchReleaseMeta(data?.projects[0]?.releases[0]);
      fetchProjectMeta(data?.projects[0]?.metaURI);
    }
  }, [data, valistCtx.valist.storage]);

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
          <ProjectMetaCard
            version={version} 
            teamName={teamName}
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