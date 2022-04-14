import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProjectMeta } from '@valist/sdk';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import { clear, selectDescription, selectDisplayName, selectMembers, selectName, selectShortDescription, selectTags, selectTeam, selectType, selectWebsite, selectYoutubeUrl, setDescription, setDisplayName, setMembers, setName, setShortDescription, setTags, setTeam, setType, setWebsite } from '../../features/projects/projectSlice';
import ProjectPreview from '../../features/projects/ProjectPreview';
import CreateProjectForm from './ProjectForm';
import Tabs from '../../components/Tabs';
import { Asset } from './ProjectGallery';

type Member = {
  id: string,
}
interface ManageProjectProps {
  accountUsername?: string,
  projectName?: string,
}

export default function ManageProject(props: ManageProjectProps) {
  // Page State
  const valistCtx = useContext(ValistContext);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts = useAppSelector(selectAccounts);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formView, setFormView] = useState('Basic Info');

  // Project State
  const projectAccount = useAppSelector(selectTeam);
  const projectDisplayName = useAppSelector(selectDisplayName);
  const projectName = useAppSelector(selectName);
  const projectDescription = useAppSelector(selectDescription);
  const projectShortDescription = useAppSelector(selectShortDescription);
  const projectWebsite = useAppSelector(selectWebsite);
  const projectMembers = useAppSelector(selectMembers);
  const projectType = useAppSelector(selectType);
  const projectTags = useAppSelector(selectTags);

  const [projectImage, setProjectImage] = useState<File[]>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [projectMembersParsed, setProjectMembersParsed] = useState<Member[]>([]);
  const [projectGallery, setProjectGallery] = useState<File[]>([]);
  const [projectAssets, setProjectAssets] = useState<Asset[]>([]);
  const youtubeUrl = useAppSelector(selectYoutubeUrl);
  const [membersChanged, setMembersChanged] = useState(0);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // Set page state for user's accounts and projects if not in edit mode
  useEffect(() => {
    if (!props.accountUsername) {
      if (accountNames.length > 0) {
        dispatch(setTeam(accountNames[0]));
      }
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

    // If props.account & props.project, render current values, else clear values
    useEffect(() => {
      (async () => {
        let projectData: ProjectMeta;
        dispatch(clear());
        
        if (props.accountUsername && props.projectName) {
          try {
            dispatch(setTeam(props.accountUsername));
            dispatch(setName(props.projectName));
            projectData = await valistCtx.getProjectMeta(props.accountUsername, props.projectName);
            if (projectData.image) setCurrentImage(projectData.image);
            if (projectData.name) dispatch(setDisplayName(projectData.name));
            if (projectData.external_url) dispatch(setWebsite(projectData.external_url));
            if (projectData.short_description) dispatch(setShortDescription(projectData.short_description));
            if (projectData.description) dispatch(setDescription(projectData.description));
            if (projectData.type) dispatch(setType(projectData.type));
            if (projectData.tags) dispatch(setTags(projectData.tags));
            if (projectData.gallery) setProjectAssets(projectData.gallery);

            const members = await valistCtx.getProjectMembers(
              props.accountUsername,
              props.projectName,
              0,
              100,
            );
    
            if (members) dispatch(setMembers(members));
            } catch (err) {
              console.log('err', err);
            }
        }
      })();
    }, [dispatch, props.accountUsername, props.projectName, valistCtx.getProjectMeta, membersChanged]);

  const createProject = async () => {
    let toastID = '';
    let imgURL = currentImage;
    let galleryItems:Asset[] = (projectGallery.length !== 0) ? [] : projectAssets;

    toastID = notify('text', 'Uploading files...');
    if (projectImage[0]) {
      imgURL = await valistCtx.writeFile(projectImage[0]);
    } else {
      imgURL = currentImage;
    }

    for (let i = 0; i < projectGallery.length; i++) {
      const url = await valistCtx.writeFile(projectGallery[i]);
      galleryItems.push({
        name: projectGallery[i].name,
        type: projectGallery[i].type,
        src: url,
      });
    };

    dismiss(toastID);

    const project = new ProjectMeta();
    project.image = imgURL;
    project.name = projectDisplayName;
    project.description = projectDescription;
    project.short_description = projectShortDescription;
    project.external_url = projectWebsite;
    project.type = projectType;
    project.tags = projectTags;
    project.gallery = galleryItems;

    console.log("Project Team", projectAccount);
    console.log("Project Name", projectDisplayName);
    console.log("Project Members", projectMembers);
    console.log("Meta", project);

    try {
      toastID = notify('pending');

      // If props.project call setProjectMeta else createTeam
      let transaction: any;
      if (props.accountUsername && props.projectName) {
        const updatedMeta = await valistCtx.writeJSON(JSON.stringify(project));
        transaction = await valistCtx.setProjectMetaURI(
          props.accountUsername, 
          props.projectName,
          updatedMeta,
        );
      } else {
        transaction = await valistCtx.createProject(
          projectAccount,
          projectName,
          project,
          projectMembers,
        );
      }

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      dismiss(toastID);
      notify('success');
      if (!(props.accountUsername && props.projectName)) {
        router.push('/');
      }
    } catch(err) {
      console.log('Error', err);
      dismiss(toastID);
      notify('error', parseError(err));
    }
  };

  const addMember = async (address: string) => {
    let toastID = '';
    let transaction;

    if (props.projectName) {
      try {
        toastID = notify('pending');
        console.log('address:', address);
        console.log('account:', projectAccount);
        console.log('projectName', props.projectName);
        transaction = await valistCtx.addProjectMember(projectAccount, props.projectName, address);
        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
        dismiss(toastID);
        notify('success');
        setMembersChanged(membersChanged + 1);
      } catch(err) {
        dismiss(toastID);
        notify('error', parseError(err));
      }
  
      dismiss(toastID);
    }
  };

  const removeMember = async (address: string) =>  {
    if (props.projectName) {
      console.log(`Removing ${address} from ${projectAccount}/${props.projectName}`);
      let toastID = '';
      let transaction: any;

      try {
        toastID = notify('pending');
        transaction = await valistCtx.removeProjectMember(projectAccount, props.projectName, address);
        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
        dismiss(toastID);
        notify('success');
        setMembersChanged(membersChanged + 1);
      } catch(err) {
        dismiss(toastID);
        notify('error', parseError(err));
      }

      dismiss(toastID);
    }
  };

  // Set page tabs
  const PageTabs = [        
    { 
      text: 'Basic Info',
      disabled: false,
    },
    { 
      text: 'Descriptions',
      disabled: false,
    },
    { 
      text: 'Members',
      disabled: false,
    },
    { 
    text: 'Graphics',
    disabled: false,
    },
  ];
  
  return (
    <div>
      <div className='border-b'>
        <Tabs setView={setFormView} view={formView} tabs={PageTabs} />
      </div>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
      {/* Right Column */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
        <div className="p-4">
            <CreateProjectForm
              edit={(props.accountUsername && props.projectName) ? true : false}
              submitText={props.accountUsername ? 'Save changes' : 'Create project'}
              userAccounts={accountNames}
              accountUsername={projectAccount}
              projectName={projectName}
              projectDisplayName={projectDisplayName}
              shortDescription={projectShortDescription}
              projectDescription={projectDescription}
              projectWebsite={projectWebsite}
              projectMembers={projectMembers}
              projectType={projectType}
              projectTags={projectTags}
              projectGallery={projectGallery}
              youtubeUrl={youtubeUrl}
              view={formView}
              setImage={setProjectImage}
              setGallery={setProjectGallery}
              addMember={addMember}
              submit={createProject}         
            />
        </div>
      </div>

      {/* Right column */}
      <div className="grid grid-cols-1 lg:col-span-7 gap-4">
        <ProjectPreview
          view={formView}
          projectAccount={projectAccount}
          projectDisplayName={projectDisplayName}
          projectImage={projectImage[0]}
          projectShortDescription={projectShortDescription} 
          projectDescription={projectDescription}
          projectWebsite={projectWebsite}
          projectMembers={projectMembersParsed}
          defaultImage={currentImage}
          projectGallery={projectGallery}
          projectAssets={projectAssets}
          removeMember={removeMember}
        />
      </div>
    </div>
    </div>
  );
};