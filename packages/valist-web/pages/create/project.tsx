import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProjectMeta } from '@valist/sdk';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import Layout from '../../components/Layouts/Main';
import Accordion from '../../components/Accordian/Accordion';
import { selectDescription, selectMembers, selectName, selectShortDescription, selectTeam, selectWebsite, setTeam } from '../../features/projects/projectSlice';
import ProjectPreview from '../../features/projects/ProjectPreview';
import CreateProjectForm from '../../features/projects/CreateProjectForm';

type Member = {
  id: string,
}

const CreatePage: NextPage = () => {
  // Page State
  const valistCtx = useContext(ValistContext);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts = useAppSelector(selectAccounts);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Project State
  // const [projectTeam, setProjectTeam] = useState<string>('');
  const projectTeam = useAppSelector(selectTeam);
  // const [projectName, setProjectName] = useState<string>('');
  const projectName = useAppSelector(selectName);
  // const [projectDescription, setProjectDescription] = useState<string>('');
  const projectDescription = useAppSelector(selectDescription);
  // const [projectShortDescription, setProjectShortDescription] = useState<string>('');
  const projectShortDescription = useAppSelector(selectShortDescription);
  // const [projectWebsite, setProjectWebsite] = useState<string>('');
  const projectWebsite = useAppSelector(selectWebsite);
  // const [projectMembers, setProjectMembers] = useState<string[]>([]);
  const projectMembers = useAppSelector(selectMembers);

  const [projectImage, setProjectImage] = useState<File | null>(null);
  const [projectMembersParsed, setProjectMembersParsed] = useState<Member[]>([]);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // Set page state for user's teams and projects
  useEffect(() => {
      if (accountNames.length > 0) {
        dispatch(setTeam(accountNames[0]));
      }
  }, [accountNames, accounts, dispatch]);

  // Normalize projectMember data for ProjectPreview component
  useEffect(() => {
    const members:Member[] = [];
    for (const projectMember of projectMembers) {
      members.push({
        id: projectMember,
      });
    }
    setProjectMembersParsed(members);
  }, [projectMembers]);

  const createProject = async () => {
    let imgURL = "";

    if (projectImage) {
      imgURL = await valistCtx.storage.writeFile(projectImage);
    }

    const project = new ProjectMeta();
    project.image = imgURL;
    project.name = projectName;
    project.description = projectDescription;
    project.short_description = projectShortDescription;
    project.external_url = projectWebsite,

    console.log("Project Team", projectTeam);
    console.log("Project Name", projectName);
    console.log("Project Members", projectMembers);
    console.log("Meta", project);

    let toastID = '';
    try {
      toastID = notify('pending'); 
      const transaction = await valistCtx.createProject(
        projectTeam,
        projectName,
        project,
        projectMembers,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash());
      await transaction.wait();

      dismiss(toastID);
      notify('success');
      router.push('/');
    } catch(err) {
      console.log('Error', err);
      dismiss(toastID);
      notify('error', parseError(err));
    }
  };

  return (
    <Layout title={`Valist | Create project`}>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
          <Accordion name={'project'} title={<div><span className='mr-4'></span>Create a New Project</div>}>
            <div className="p-4">
              <CreateProjectForm
                teamName={projectTeam}
                projectName={projectName}
                projectDescription={projectDescription}
                projectWebsite={projectWebsite}
                projectMembers={projectMembers}
                userTeams={accountNames}
                setImage={setProjectImage}
                submit={createProject}          
              />
            </div>
          </Accordion>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <ProjectPreview
            teamName={projectTeam} 
            projectName={projectName} 
            projectImage={projectImage} 
            projectDescription={projectDescription} 
            projectMembers={projectMembersParsed} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreatePage;

