import { useLazyQuery } from '@apollo/client';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { ReleaseMeta, LicenseMeta, ProjectMeta } from '@valist/sdk';
import { BigNumberish } from 'ethers';
import ValistContext from '../../features/valist/ValistContext';
import { Project } from '../../utils/Apollo/types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import Layout from '../../components/Layouts/Main';
import Accordion from '../../components/Accordian/Accordion';
import CreateLicenseForm from '../../features/licenses/CreateLicenseForm';
import LicensePreview from '../../features/licenses/LicensePreview';

type Member = {
  id: string,
}

const CreateLicensePage: NextPage = () => {
  // Page State
  const router = useRouter();
  const valistCtx = useContext(ValistContext);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts =   useAppSelector(selectAccounts);
  const dispatch = useAppDispatch();

  // License State
  const [licenseImage, setLicenseImage] = useState<File | null>(null);
  const [licenseTeam, setLicenseTeam] = useState<string>('');
  const [licenseProject, setLicenseProject] = useState<string>('');
  const [licenseName, setLicenseName] = useState<string>('');
  const [licenseDescription, setLicenseDescription] = useState<string>('');
  const [licnesePrice, setLicensePrice] = useState<BigNumberish>(0);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // If the selected licenseTeam changes set the projectNames under that team
  // useEffect(() => {
  //   (async () => {
  //     if (licenseTeam) {
  //       const projectNames = getProjectNames(userTeams, licenseTeam);
  //       setTeamProjectNames(projectNames);
  //       setLicenseProject(projectNames[0] || '');
  //     }
  //   })();
  // }, [licenseTeam, userTeams]);

  const createLicense = async () => {
    let imgURL = "";

    if (licenseImage) {
      imgURL = await valistCtx.storage.writeFile(licenseImage);
    }

    const license = new LicenseMeta();
		license.image = imgURL,
		license.name = licenseName,
		license.description = licenseDescription,
		license.external_url = '',

    console.log("License Team", licenseTeam);
    console.log("License Project", licenseProject);
    console.log("License Name", licenseName);
    console.log("Meta", license);

    let toastID = '';
    try {
      toastID = notify('pending');
      const transaction = await valistCtx.createLicense(
        licenseTeam,
        licenseProject,
        licenseName,
        license,
        licnesePrice,
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
    <Layout title={`Valist | Create License`}>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
          <Accordion name={'license'} title={
            <div>
              <span className='mr-4'></span>Create a License
            </div>
          }>
            <div className="p-4">
              <CreateLicenseForm
                teamNames={accountNames}
                projectNames={[]}
                licenseTeam={licenseTeam}
                licenseProject={licenseProject}
                licenseName={licenseName}
                setImage={setLicenseImage}
                submit={createLicense}
              />
            </div>
          </Accordion>
        </div>

        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <LicensePreview 
            licenseTeam={licenseTeam}
            licenseProject={licenseProject}
            licenseName={licenseName} 
            licenseImage={licenseImage}
            licenseDescription={licenseDescription}            
          />
        </div>
      </div>
    </Layout>
  );
};

export default CreateLicensePage;
