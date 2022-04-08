import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { LicenseMeta } from '@valist/sdk';
import { BigNumber } from 'ethers';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectAccounts, selectLoginTried, selectLoginType } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import parseError from '../../utils/Errors';
import Layout from '../../components/Layouts/Main';
import CreateLicenseForm from '../../features/licenses/CreateLicenseForm';
import LicensePreview from '../../features/licenses/LicensePreview';
import { getProjectNames } from '../../utils/Apollo/normalization';
import { selectDescription, selectName, selectPrice, selectProject, selectTeam, setName, setProject } from '../../features/licenses/licenseSlice';

const CreateLicensePage: NextPage = () => {
  // Page State
  const router = useRouter();
  const valistCtx = useContext(ValistContext);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const accountNames = useAppSelector(selectAccountNames);
  const accounts =   useAppSelector(selectAccounts);
  const dispatch = useAppDispatch();
  const [accountProjectNames, setAccountProjectNames] = useState<string[]>([]);

  // License State
  const licenseTeam = useAppSelector(selectTeam);
  const licenseProject = useAppSelector(selectProject);
  const licenseName = useAppSelector(selectName);
  const licenseDescription = useAppSelector(selectDescription);
  const licnesePrice = useAppSelector(selectPrice);
  const [licenseImage, setLicenseImage] = useState<File | null>(null);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // If the selected licenseTeam changes set the projectNames under that team
  useEffect(() => {
    (async () => {
      if (licenseTeam) {
        const projectNames = getProjectNames(accounts, licenseTeam);
        setAccountProjectNames(projectNames);
        dispatch(setProject(projectNames[0] || ''));
      }
    })();
  }, [accounts, licenseTeam]);

  const createLicense = async () => {
    let imgURL = "";

    if (licenseImage) {
      imgURL = await valistCtx.writeFile(licenseImage);
    }

    const license = new LicenseMeta();
		license.image = imgURL,
		license.name = licenseName,
		license.description = licenseDescription,
		license.external_url = '',

    console.log("License Team", licenseTeam);
    console.log("License Project", licenseProject);
    console.log("License Name", licenseName);
    console.log("Price", BigNumber.from(licnesePrice));
    console.log("Meta", license);

    let toastID = '';
    try {
      toastID = notify('pending');
      const transaction = await valistCtx.createLicense(
        licenseTeam,
        licenseProject,
        licenseName,
        license,
        BigNumber.from(licnesePrice),
      );

      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
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
            <div className="p-4">
              <CreateLicenseForm
                teamNames={accountNames}
                projectNames={accountProjectNames}
                licenseTeam={licenseTeam}
                licenseProject={licenseProject}
                licenseName={licenseName}
                setImage={setLicenseImage}
                submit={createLicense}
              />
            </div>
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
