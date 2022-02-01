import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { Client, Contract, Storage } from '@valist/sdk';
import Layout from "../../../components/Layouts/Main";
import ProjectContent from "../../../components/Projects/ProjectContent";
import ProjectMetaCard from "../../../components/Projects/ProjectMetaCard";
import ProjectProfileCard from "../../../components/Projects/ProjectProfileCard";
import { PROJECT_PROFILE_QUERY } from "../../../utils/Apollo/queries";
import { Member, ProjectMeta, Release, ReleaseMeta } from "../../../utils/Apollo/types";
import { parseCID } from "../../../utils/Ipfs";
import ValistContext from "../../../components/Valist/ValistContext";

export default function ProjectPage():JSX.Element {
  const router = useRouter();
  const teamName = `${router.query.teamName}`;
  const projectName = `${router.query.projectName}`;
  const valistCtx = useContext(ValistContext);
  const [projectID, setProjectID] = useState<string>('');
  const { data, loading, error } = useQuery(PROJECT_PROFILE_QUERY, {
    variables: { project: projectID },
  });
  const [view, setView] = useState<string>('Readme');
  const [projectMeta, setProjectMeta] = useState<ProjectMeta>({
    name: 'loading',
    description: 'loading',
  });
  const [members, setMembers] = useState<Member[]>([]);
  const [releases, setReleases] = useState<Release[]>([]);
  const [releaseMeta, setReleaseMeta] = useState<ReleaseMeta>({
    name: 'loading',
    readme: '# Readme Not Found',
    artifacts: {
      loading: {
        sha256: 'loading',
        provider: 'loading',
      },
    },
  });

  const fetchReleaseMeta = async (release: Release) => {
    console.log('release', release);
    if (release && release.metaURI !== '') {
      const parsedCID = parseCID(release.metaURI);
      const requestURL = `http://localhost:8080/ipfs/${parsedCID}`;
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
    const requestURL = `http://localhost:8080/ipfs/${parsedCID}`;
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
        const id = await valist.contract.getProjectID(teamID, projectName);
        setProjectID(id._hex);
      }
    })();

    if (data && data.projects && data.projects[0].members) {
      setMembers(data.projects[0].members);
      setReleases(data.projects[0].releases);
      fetchReleaseMeta(data.projects[0].releases[0]);
      fetchProjectMeta(data.projects[0].metaURI);
    }
  }, [data, teamName, valistCtx]);

  console.log('data', data);
  
  return (
    <Layout title="Valist | Project">
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-6 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          <ProjectProfileCard 
            view={view}
            setView={setView} 
            teamName={teamName}
            projectName={projectName} 
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