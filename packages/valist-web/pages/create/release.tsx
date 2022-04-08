import Layout from '../../components/Layouts/Main';
import ValistContext from '../../features/valist/ValistContext';
import parseError from '../../utils/Errors';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ReleaseMeta } from '@valist/sdk';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import { selectName, selectDescription, selectLicenses, selectProject, selectTeam, setLicenses, setProject, setTeam } from '../../features/releases/releaseSlice';
import { getProjectNames } from '../../utils/Apollo/normalization';
import ReleasePreview from '../../features/releases/ReleasePreview';
import PublishReleaseForm from '../../features/releases/PublishReleaseForm';

const PublishReleasePage: NextPage = () => {
  // Page State
  const router = useRouter();
  const valistCtx = useContext(ValistContext);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts =   useAppSelector(selectAccounts);
  const dispatch = useAppDispatch();

  // Release State
  const account = useAppSelector(selectTeam);
  const project = useAppSelector(selectProject);
  const name = useAppSelector(selectName);
  const description = useAppSelector(selectDescription);
  const license = useAppSelector(selectLicenses);
  
  const [releaseFiles, setReleaseFiles] = useState<File[]>([]);
  const [availableProjects, setAvailableProjects] = useState<string[]>([]);
  const [availableLicenses, setAvailableLicenses] = useState<string[]>([]);
  const [releaseImage, setReleaseImage] = useState<File | null>(null);

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

  // On page load set releaseAccount from url or from first item in list of user accounts
  useEffect(() => {
    dispatch(setTeam(incomingAccount || accountNames[0]));

    if (incomingAccount) {
       const projectNames = getProjectNames(accounts, incomingAccount);
       setAvailableProjects(projectNames);
       dispatch(setProject(incomingProject || projectNames[0] || ''));
    }
  }, [accountNames, accounts, dispatch, incomingAccount, incomingProject]);

  // If the selected releaseTeam changes set the projectNames under that team
  useEffect(() => {
    if (account && account !== incomingAccount) {
      const projectNames = getProjectNames(accounts, account);
      setAvailableProjects(projectNames);
      dispatch(setProject(projectNames[0] || ''));
    }
  }, [account, accounts, dispatch, incomingAccount]);

  // Query available license names if team or project change
  useEffect(() => {
    (async () => {
      let licenses = [];
      try {
        licenses = await valistCtx.getLicenseNames(
          account,
          project,
          0,
          1000,
        );

        if (licenses.length !== 0) {
          setAvailableLicenses(licenses);
          dispatch(setLicenses([licenses[0]]));
        } else {
          setAvailableLicenses([]);
          dispatch(setLicenses([]));
        }
      } catch (err) {
        console.log('err', err);
      }
    })();
  }, [account, dispatch, project, valistCtx.getLicenseNames]);

  const createRelease = async () => {
    let imgURL = "";

    if (releaseImage) {
      imgURL = await valistCtx.writeFile(releaseImage);
    }

    const release = new ReleaseMeta();
		release.image = imgURL;
		release.name = name;
		release.description = description;
    release.licenses = license;
    
    const uploadToast = notify('text', 'Uploading files...');
    console.log('files', releaseFiles);
    release.external_url = await valistCtx.writeFolder(releaseFiles);
    dismiss(uploadToast);
  
    console.log("Release Team", account);
    console.log("Release Project", project);
    console.log("Release Name", name);
    console.log("Meta", release);

    let toastID = '';
    try {
      toastID = notify('pending');
      const transaction = await valistCtx.createRelease(
        account,
        project,
        name,
        release,
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();
      
      dismiss(toastID);
      notify('success');
      router.push('/');
    } catch(err: any) {
      console.log('Error', err);
      dismiss(toastID);
      notify('error', parseError(err));
    }
  };

  return (
    <Layout title={`Valist | Publish Release`}>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
            <div className="p-4">
              <PublishReleaseForm
                teamNames={accountNames}
                projectNames={availableProjects}
                releaseTeam={account}
                releaseProject={project}
                releaseName={name}
                releaseFiles={releaseFiles}
                releaseLicenses={availableLicenses}
                releaseLicense={license[0]}
                setImage={setReleaseImage}
                setFiles={setReleaseFiles}
                submit={() => {createRelease();}}
              />
            </div>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <ReleasePreview 
            releaseTeam={account}
            releaseProject={project}
            releaseName={name} 
            releaseImage={releaseImage}
            releaseDescription={description}            
          />
        </div>
      </div>
    </Layout>
  );
};

export default PublishReleasePage;
