import Layout from '../../components/Layouts/Main';
import ValistContext from '../../features/valist/ValistContext';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoading, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { selectName, selectDescription, selectProject, selectTeam, setProject, setTeam, clear } from '../../features/releases/releaseSlice';
import { getProjectNames } from '../../utils/Apollo/normalization';
import ReleasePreview from '../../features/releases/ReleasePreview';
import PublishReleaseForm from '../../features/releases/PublishReleaseForm';
import { useListState } from '@mantine/hooks';
import { FileList } from '@/components/Files/FileUpload';
import { createRelease } from '@/utils/Valist';

const PublishReleasePage: NextPage = () => {
  // Page State
  const router = useRouter();
  const valistCtx = useContext(ValistContext);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts = useAppSelector(selectAccounts);
  const loading = useAppSelector(selectLoading);
  const dispatch = useAppDispatch();

  // Release State
  const account = useAppSelector(selectTeam);
  const project = useAppSelector(selectProject);
  const name = useAppSelector(selectName);
  const description = useAppSelector(selectDescription);
  
  const [projectID, setProjectID] = useState<string | null>(null);
  const [releaseImage, setReleaseImage] = useListState<FileList>([]);
  const [releaseFiles, setReleaseFiles] = useListState<FileList>([]);
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [isDefaults, setIsDefaults] = useState<boolean>(false);

  let incomingAccount = (router.query.account as string | undefined);
  let incomingProject = (router.query.project as string | undefined);

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
  }, [dispatch]);

  // On page load set releaseAccount from url or from first item in list of user accounts
  useEffect(() => {
    if (incomingAccount && accounts && !loading && !isDefaults) {
      dispatch(setTeam(incomingAccount || accountNames[0]));
      const projectNames = getProjectNames(accounts, incomingAccount);

      setAvailableProjects(projectNames);
      dispatch(setProject(incomingProject || projectNames[0] || ''));
      setIsDefaults(true);
    }
  }, [accounts, loading]);
  
  // If the selected releaseAccount changes set the projectNames under that account
  useEffect(() => {
    if (account && accounts && isDefaults) {
      const projectNames = getProjectNames(accounts, account);
      setAvailableProjects(projectNames);
    }
  }, [account, accountNames]);

  console.log('loading', loading);

  const handleSubmit = () => {
    if (projectID) {
      createRelease(
        account,
        project,
        projectID,
        name,
        description,
        releaseImage,
        releaseFiles,
        router,
        valistCtx,
      );
    };
  };

  return (
    <Layout title={`Valist | Publish Release`}>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
            <div className="p-4">
              {isDefaults && <PublishReleaseForm
                teamNames={accountNames}
                projectID={projectID}
                projectNames={availableProjects}
                releaseTeam={account}
                releaseProject={project}
                releaseDescription={description} 
                releaseName={name}
                releaseFiles={releaseFiles}
                setProjectID={setProjectID}
                releaseImage={releaseImage} 
                setImage={setReleaseImage}
                setFiles={setReleaseFiles}
                submit={handleSubmit}              
              />}
            </div>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <ReleasePreview 
            releaseTeam={account}
            releaseProject={project}
            releaseName={name} 
            releaseImage={(releaseImage[0] && typeof releaseImage[0].src === 'object') ? releaseImage[0].src : null}
            releaseDescription={description}            
          />
        </div>
      </div>
    </Layout>
  );
};

export default PublishReleasePage;
