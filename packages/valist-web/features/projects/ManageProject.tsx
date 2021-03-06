import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ProjectMeta } from '@valist/sdk';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames } from '../../features/accounts/accountsSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import { clear, selectAccount, selectDescription, selectDisplayName, selectLimit, selectMembers, selectName, selectPrice, selectRoyalty, selectRoyaltyAddress, selectShortDescription, selectTags, selectType, selectWebsite, selectYouTubeUrl, setDescription, setDisplayName, setLimit, setMembers, setName, setPrice, setRoyalty, setRoyaltyAddress, setShortDescription, setTags, setAccount, setType, setWebsite } from '../../features/projects/projectSlice';
import ProjectPreview from '../../features/projects/ProjectPreview';
import ProjectForm from './ProjectForm';
import Tabs from '../../components/Tabs';
import { Asset } from './ProjectGallery';
import { generateID } from '@valist/sdk';
import getConfig from 'next/config';
import { ethers } from 'ethers';
import { useListState } from '@mantine/hooks';
import { FileList } from '@/components/Files/FileUpload';
import { createOrUpdateProject } from '@/utils/Valist';

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
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formView, setFormView] = useState('Basic Info');
  const { publicRuntimeConfig } = getConfig();
  const [tabs, handleTabs] = useListState<{text: string, disabled: boolean}>([
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
    {
      text: 'Pricing',
      disabled: !(props.accountUsername && props.projectName),
    },
  ]);

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

  const handleSubmit = () => {
    createOrUpdateProject(
      (props.accountUsername && props.projectName ? false : true),
      accountID,
      projectID,
      projectAccount,
      projectName,
      projectDisplayName,
      projectDescription,
      projectShortDescription,
      projectWebsite,
      projectMembers,
      projectImage,
      projectGallery,
      projectType,
      projectTags,
      projectPrice,
      projectRoyalty,
      projectRoyaltyAddress,
      projectLimit,
      projectAssets,
      currentImage,
      previousMeta,
      youtubeUrl,
      router,
      valistCtx,
    );
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
  
  return (
    <div>
      <div>
        <Tabs setView={setFormView} view={formView} tabs={tabs} />
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
              projectID={projectID}
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
              submit={handleSubmit}         
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