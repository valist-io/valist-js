import { useQuery } from '@apollo/client';
import { BigNumber } from 'ethers';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import AccountContext from '../components/Accounts/AccountContext';
import Layout from '../components/Layouts/Main';
import Accordion from '../components/Publishing/Accordion';
import CreateProjectForm from '../components/Publishing/CreateProjectForm';
import CreateTeamForm from '../components/Publishing/CreateTeamForm';
import ProjectPreview from '../components/Publishing/ProjectPreview';
import PublishReleaseForm from '../components/Publishing/PublishReleaseForm';
import ReleasePreview from '../components/Publishing/ReleasePreview';
import TeamPreview from '../components/Publishing/TeamPreview';
import ValistContext from '../components/Valist/ValistContext';
import { USER_TEAMS } from '../utils/Apollo/queries';

type TeamMember = {
  id: string
}

const CreateTeamPage: NextPage = () => {
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);
  const router = useRouter();
  let { action } = router.query
  if (Array.isArray(action)) {
    action = action.join('');
  }
  if (!action) {
    action = ''
  }

  // Page State
  const [view, setView] = useState<string>('');
  const [renderTeam, setRenderTeam] = useState<boolean>(false);
  const [renderProject, setRenderProject] = useState<boolean>(false);
  const [renderRelease, setRenderRelease] = useState<boolean>(false);
  const { data, loading, error } = useQuery(USER_TEAMS, {
    variables: { address: accountCtx.address.toLowerCase() },
  });
  const [userTeams, setUserTeams] = useState<any>([]);
  const [teamProjects, setTeamProjects] = useState<any>([]);

  // Team State
  const [teamImage, setTeamImage] = useState<string>('');
  const [teamName, setTeamName] = useState<string>('teamName');
  const [teamDescription, setTeamDescription] = useState<string>('An example team description.');
  const [teamBeneficiary, setTeamBeneficiary] = useState<string>('');
  const [teamMembers, setTeamMembers] = useState<string[]>([]);
  const [teamMembersParsed, setTeamMembersParsed] = useState<TeamMember[]>([]);

  // Project State
  const [projectTeam, setProjectTeam] = useState<string>('');
  const [projectImage, setProjectImage] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('projectName');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const [projectMembersParsed, setprojectMembersParsed] = useState<TeamMember[]>([]);

  // Release State
  const [releaseImage, setReleaseImage] = useState<string>('');
  const [releaseTeam, setReleaseTeam] = useState<string>('');
  const [releaseProject, setReleaseProject] = useState<string>('');
  const [releaseName, setReleaseName] = useState<string>('0.0.1');
  const [releaseDescription, setReleaseDescription] = useState<string>('');
  const [releaseArtifacts, setReleaseArtifacts] = useState<string[]>([]);

  useEffect(() => {
    setRenderTeam(action === 'team')
    setRenderProject(action === 'project')
    setRenderRelease(action === 'release')
    setView(action as string);
  }, [action]);

  useEffect(() => {
    if (data && data?.users && data?.users[0] && data?.users[0].teams) {
      const teams = [];
      for (const team of data.users[0].teams) {
        teams.push(team.name);
      }
      setUserTeams(teams);
      console.log('teams', teams);
      if (teams.length > 0) {
        setProjectTeam(teams[0]);
        setReleaseTeam(teams[0]);

        if (data.users[0].teams[0].projects) {
          const projects = [];
          for (const project of data.users[0].teams[0].projects) {
            projects.push(project.name);
          }
          setTeamProjects(projects);
          setReleaseProject(projects[0]);
        }
      }
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      console.log("releaseTeam", releaseTeam)
      if (releaseTeam) {
        // const projects = await valistCtx.valist.getProjectNames(releaseTeam, BigNumber.from(1), BigNumber.from(10));
        // setTeamProjects(projects);
      }
    })();
  }, [releaseTeam]);

  useEffect(() => {
    const members:TeamMember[] = []
    for (const teamMember of teamMembers) {
      members.push({
        id: teamMember,
      });
    }
    setTeamMembersParsed(members);
  }, [teamMembers]);

  useEffect(() => {
    const members:TeamMember[] = []
    for (const projectMember of projectMembers) {
      members.push({
        id: projectMember,
      });
    }
    setprojectMembersParsed(members);
  }, [projectMembers]);

  const createTeam = () => {
    valistCtx.valist.createTeam(
      teamName,
      {
        image: teamImage,
        name: teamName,
        description: teamDescription,
        external_url: '',
      },
      teamBeneficiary, 
      teamMembers,
    )
  }

  const createProject = () => {
    valistCtx.valist.createProject(
      projectTeam,
      projectName,
      {
        image: projectImage,
        name: projectName,
        description: teamDescription,
        external_url: '',
      },
      projectMembers,
    )
  }

  const createRelease = () => {
    valistCtx.valist.createRelease(
      releaseTeam,
      releaseProject,
      releaseName,
      {
        image: releaseImage,
        name: releaseProject,
        description: releaseDescription,
        external_url: '',
      },
    )
  }

  const renderPreview = (view: string) => {
    switch (view) {
      case 'team':
        return (<TeamPreview
        teamDescription={teamDescription}
        teamName={teamName}
        teamImage={teamImage}
        teamMembers={teamMembersParsed}/>)
      case 'project':
        return <ProjectPreview 
        teamName={projectTeam} 
        projectName={projectName} 
        projectImage={projectImage} 
        projectDescription={projectDescription} 
        projectMembers={projectMembersParsed} 
      />
      case 'release':
        return <ReleasePreview 
        releaseTeam={releaseTeam}
        releaseProject={releaseProject}
        releaseName={releaseName} 
        releaseImage={releaseImage}
        releaseDescription={releaseDescription}            
      />
      default:
        return (<div>Page Not Found</div>)
    }
  };

  return (
    <Layout title="Valist | Create Team">
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
          {renderTeam && <Accordion view={view} name={'team'} setView={setView} title={<div><span className='mr-4'></span>Create a Team or Personal Account</div>} active={true}>
            <div className="p-4">
              <CreateTeamForm
                teamName={teamName} 
                teamMembers={teamMembers} 
                teamDescription={teamDescription}   
                setName={setTeamName}
                setImage={setTeamImage}
                setDescription={setTeamDescription}
                setMembers={setTeamMembers}
                setBeneficiary={setTeamBeneficiary}
                submitText={(action != 'project') ? 'Create Team' : 'Continue to Project'}
                submit={() => {
                  if (action != 'team') {
                    setView(action as string);
                  } else {
                    createTeam();
                  }
                }}           
              />
            </div>
          </Accordion>}

          {renderProject && <Accordion view={view} name={'project'} setView={setView} title={<div><span className='mr-4'></span>Create a New Project</div>}>
            <div className="p-4">
              <CreateProjectForm
                setView={setView}
                userTeams={userTeams}
                setRenderTeam={setRenderTeam}
                setName={setProjectName}
                setImage={setProjectImage}
                setDescription={setProjectDescription}
                setMembers={setProjectMembers}
                submit={() => {
                  if (action === 'release') {
                    setView(action as string);
                  } else {
                    createProject();
                  };
                } }
                projectName={''}
                projectDescription={''} 
                setTeam={setProjectTeam}              
              />
            </div>
          </Accordion>}

          {renderRelease && <Accordion view={view} name={'release'} setView={setView} title={<div><span className='mr-4'> </span>Publish Release</div>}>
            <div className="p-4">
              <PublishReleaseForm
                teamNames={userTeams}
                projectNames={teamProjects}
                releaseTeam={releaseTeam}
                releaseProject={releaseProject}
                releaseName={releaseName}  
                setImage={setReleaseImage}
                setTeam={setReleaseTeam}
                setProject={setReleaseProject}
                setName={setReleaseName}
                setDescription={setReleaseDescription}
                setAritfacts={setReleaseArtifacts}
                setRenderTeam={setRenderTeam}
                setRenderProject={setRenderProject}
                submit={() => {createRelease()}}
                setView={setView} 
              />
            </div>
          </Accordion>}
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          {renderPreview(view)}
        </div>
      </div>
    </Layout>
  );
};

export default CreateTeamPage;
