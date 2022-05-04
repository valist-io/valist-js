import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProjectMeta } from '@valist/sdk';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import { clear, selectAccount, selectDescription, selectDisplayName, selectLimit, selectMembers, selectName, selectPrice, selectRoyalty, selectRoyaltyAddress, selectShortDescription, selectTags, selectType, selectWebsite, selectYouTubeUrl, setDescription, setDisplayName, setLimit, setMembers, setName, setPrice, setRoyalty, setRoyaltyAddress, setShortDescription, setTags, setAccount, setType, setWebsite } from '../../features/projects/projectSlice';
import ProjectPreview from '../../features/projects/ProjectPreview';
import ProjectForm from './ProjectForm';
import Tabs from '../../components/Tabs';
import { Asset } from './ProjectGallery';
import { generateID } from '@valist/sdk';
import getConfig from 'next/config';
import { BigNumber, ethers } from 'ethers';
import { projectMetaChanged } from '../../utils/Validation';
import { useListState } from '@mantine/hooks';
import { FileList } from '@/components/Files/FileUpload';

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
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formView, setFormView] = useState('Basic Info');
  const { publicRuntimeConfig } = getConfig();

  // Project State
  const projectAccount = useAppSelector(selectAccount);
  const projectDisplayName = useAppSelector(selectDisplayName);
  const projectName = useAppSelector(selectName);
  const projectPrice = useAppSelector(selectPrice);
  const projectLimit = useAppSelector(selectLimit);
  const projectRoyalty = useAppSelector(selectRoyalty);
  const projectRoyaltyAddress = useAppSelector(selectRoyaltyAddress);
  const projectDescription = useAppSelector(selectDescription);
  const projectShortDescription = useAppSelector(selectShortDescription);
  const projectWebsite = useAppSelector(selectWebsite);
  const projectMembers = useAppSelector(selectMembers);
  const projectType = useAppSelector(selectType);
  const projectTags = useAppSelector(selectTags);

  const [accountID, setAccountID] = useState<string>('');
  const [previousMeta, setPreviousMeta] = useState<ProjectMeta>({});
  const [projectID, setProjectID] = useState<string>('');
  const [projectGallery, handleGallery] = useListState<FileList>([]);
  const [mainImage, setMainImage] = useListState<FileList>([]);
  const [projectImage, setProjectImage] = useListState<FileList>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [projectMembersParsed, setProjectMembersParsed] = useState<Member[]>([]);
  const [projectAssets, setProjectAssets] = useState<Asset[]>([]);
  const youtubeUrl = useAppSelector(selectYouTubeUrl);
  const [membersChanged, setMembersChanged] = useState(0);

  console.log('projectAccount', projectAccount);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // On page load, clear any input from previous pages/sessions
  useEffect(() => {
    dispatch(clear());
  }, []);

  // On initial page load, if in edit mode, set projectAccount & projectName
  useEffect(() => {
    console.log('accountUsername', props.accountUsername);
    dispatch(setAccount(props.accountUsername || accountNames[0]));

    if (props.projectName) {
      dispatch(setName(props.projectName));
    }
  }, []);

  // If projectAccount && projectName, generate account and projectID
  useEffect(() => {
    if (projectAccount && projectName) {
      const chainID = publicRuntimeConfig.CHAIN_ID;
      const accountID = generateID(chainID, projectAccount);
      setAccountID(accountID);
      
      const projectID = generateID(accountID, projectName);
      setProjectID(projectID);
    }
  }, [projectAccount, projectName, publicRuntimeConfig.CHAIN_ID]);
  
  // If in edit mode & projectID && valistCtx, render current values in form
  useEffect(() => {
    (async () => {
      let projectData: ProjectMeta;
      
      if (props.accountUsername && props.projectName && projectID && valistCtx && valistCtx.getProjectMeta) {
        try {
          projectData = await valistCtx.getProjectMeta(projectID);
          setPreviousMeta(projectData);

          if (projectData.name) dispatch(setDisplayName(projectData.name));
          if (projectData.external_url) dispatch(setWebsite(projectData.external_url));
          if (projectData.short_description) dispatch(setShortDescription(projectData.short_description));
          if (projectData.description) dispatch(setDescription(projectData.description));
          if (projectData.type) dispatch(setType(projectData.type));
          if (projectData.tags) dispatch(setTags(projectData.tags));

          if (projectData.image) setCurrentImage(projectData.image);
          if (projectData.gallery) {
            projectData.gallery.map((item) => {
              const galleryItem = {
                name: item.name,
                type: item.type,
                src: item.src,
              };
              if (!projectGallery.includes(galleryItem)) {
                handleGallery.append(galleryItem);
              }
            });
          }

          if (projectData.main_capsule) setMainImage.setState([{
            src: projectData.main_capsule,
            type: '',
            name: projectData.main_capsule,
          }]);

          const members = await valistCtx.getProjectMembers(projectID);
          if (members) dispatch(setMembers(members));

          const price = await valistCtx.getProductPrice(projectID);
          dispatch(setPrice(ethers.utils.formatEther(price).toString()));

          const limit = await valistCtx.getProductLimit(projectID);
          dispatch(setLimit(limit.toString()));

          const royalty = await valistCtx.getProductRoyaltyInfo(projectID, ethers.BigNumber.from(10000));
          dispatch(setRoyalty(royalty[1].div(100).toString()));
          dispatch(setRoyaltyAddress(royalty[0]));
        } catch (err) {
          console.log('err', err);
        }
      }
    })();
  }, [dispatch, projectID, props.accountUsername, props.projectName]);

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
    if (!projectID || !valistCtx) return;
    let toastID = '';
    let imgURL = currentImage;
    let galleryItems:Asset[] = (projectGallery.length !== 0) ? [] : [...projectAssets];

    const uploadToast = notify('text', 'Uploading files...');
    if (projectImage.length > 0) {
      imgURL = await valistCtx.writeFile({
        // @ts-ignore
        path: projectImage[0].src.path, 
        content: projectImage[0].src,
      });
    } else {
      imgURL = currentImage;
    }

    if (youtubeUrl) {
      galleryItems.push({
        name: youtubeUrl,
        type: 'youtube',
        src: youtubeUrl,
      });
    }

    for (let i = 0; i < projectGallery.length; i++) {
      if (typeof projectGallery[i].src === "object") {
        const url = await valistCtx.writeFile({
          // @ts-ignore
          path: projectGallery[i].src.path,
          content: projectGallery[i].src,
        });

        galleryItems.push({
          name: projectGallery[i].name,
          type: projectGallery[i].type,
          src: url,
        });
      } else if (typeof projectGallery[i].src === "string") {
        galleryItems.push({
          name: projectGallery[i].name,
          type: projectGallery[i].type,
          // @ts-ignore
          src: projectGallery[i].src,
        });
      }
    };

    setTimeout(() => {
      // set artificial buffer for if upload is too quick, since react-hot-toast doesn't like when you call dismiss too fast
      dismiss(uploadToast);
    }, 300);

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
    console.log("Project Name", projectName);
    console.log("Project Display Name", projectDisplayName);
    console.log("Project Members", projectMembers);
    console.log("Meta", project);
 
    try {
      const metaChanged = projectMetaChanged(previousMeta, project);

      // If props.project call setProjectMeta else createTeam
      let transaction: any;
      if (props.accountUsername && props.projectName) {
        if (metaChanged) {
          toastID = notify('pending');
          transaction = await valistCtx.setProjectMeta(
            projectID,
            project,
          );

          dismiss(toastID);
          toastID = notify('transaction', transaction.hash);
          await transaction.wait();
        } else {
          notify('message', 'Project Meta has not changed.');
        }
      } else {
        toastID = notify('pending');
        transaction = await valistCtx.createProject(
          accountID,
          projectName,
          project,
          projectMembers,
        );

        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
      }

      const previousPrice = await valistCtx.getProductPrice(projectID) || 0;
      const currentPrice = ethers.utils.parseEther(projectPrice || '0');

      if (!currentPrice.eq(previousPrice)) {
        transaction = await valistCtx.setProductPrice(
          projectID,
          currentPrice,
        );

        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
  
        dismiss(toastID);
        notify('success');
      }

      const previousLimit = await valistCtx.getProductLimit(projectID);
      const currentLimit = BigNumber.from(projectLimit);

      if (!currentLimit.eq(previousLimit)) {
        transaction = await valistCtx.setProductLimit(
          projectID,
          currentLimit,
        );

        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
  
        dismiss(toastID);
        notify('success');
      }

      const _royalty = await valistCtx.getProductRoyaltyInfo(projectID, BigNumber.from(10000));
      const previousRoyalty = _royalty[1].div(100);
      const currentRoyalty = BigNumber.from(projectRoyalty);

      if (!currentRoyalty.eq(previousRoyalty)) {
        transaction = await valistCtx.setProductRoyalty(
          projectID,
          projectRoyaltyAddress,
          Number(currentRoyalty) * 100,
        );

        dismiss(toastID);
        toastID = notify('transaction', transaction.hash);
        await transaction.wait();
  
        dismiss(toastID);
        notify('success');
      }

      if (!(props.accountUsername && props.projectName) && metaChanged) {
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

    if (projectID && props.projectName && valistCtx) {
      try {
        toastID = notify('pending');
        console.log('address:', address);
        console.log('account:', projectAccount);
        console.log('projectName', props.projectName);
        transaction = await valistCtx.addProjectMember(projectID, address);
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
    if (projectID && props.projectName && valistCtx) {
      console.log(`Removing ${address} from ${projectAccount}/${props.projectName}`);
      let toastID = '';
      let transaction: any;

      try {
        toastID = notify('pending');
        transaction = await valistCtx.removeProjectMember(projectID, address);
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
      text: 'Pricing',
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
            <ProjectForm
              edit={(props.accountUsername && props.projectName) ? true : false}
              submitText={props.accountUsername ? 'Save changes' : 'Create project'}
              userAccounts={accountNames}
              accountUsername={projectAccount}
              accountID={accountID}
              projectName={projectName}
              projectDisplayName={projectDisplayName}
              price={projectPrice}
              limit={projectLimit}
              royalty={projectRoyalty}
              royaltyAddress={projectRoyaltyAddress}
              shortDescription={projectShortDescription}
              projectDescription={projectDescription}
              projectWebsite={projectWebsite}
              projectMembers={projectMembers}
              projectType={projectType}
              projectTags={projectTags}
              projectGallery={projectGallery}
              youtubeUrl={youtubeUrl}
              view={formView}
              setMainImage={setMainImage}
              setImage={setProjectImage}
              setGallery={handleGallery}
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
            projectImage={(projectImage[0] && typeof projectImage[0].src === 'object') ? projectImage[0].src : null}
            mainImage={(mainImage[0] && typeof mainImage[0].src === 'object') ? mainImage[0].src : null}
            projectShortDescription={projectShortDescription}
            projectDescription={projectDescription}
            projectWebsite={projectWebsite}
            projectMembers={projectMembersParsed}
            defaultImage={currentImage}
            projectGallery={projectGallery}
            projectAssets={projectAssets}
            youtubeUrl={youtubeUrl}
            removeMember={removeMember}
          />
        </div>
      </div>
    </div>
  );
};