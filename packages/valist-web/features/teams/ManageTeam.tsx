import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ValistContext from '../valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectLoginTried, selectLoginType, setAccountNames } from '../accounts/accountsSlice';
import { showLogin } from '../modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import { setTeam } from '../projects/projectSlice';
import { selectDescription, selectWebsite, selectBeneficiary, selectMembers, setWebsite, setDescription, setDisplayName, clear, selectUsername, setUsername, selectDisplayName } from './teamSlice';
import parseError from '../../utils/Errors';
import TeamPreview from './TeamPreview';
import CreateTeamForm from './TeamForm';
import { TransactionAPI } from '@valist/sdk/dist/contract';
import Tabs from '../../components/Tabs';

type Member = {
  id: string,
}

interface EditAccountProps {
  accountUsername?: string,
}

export default function ManageAccount(props: EditAccountProps) {
  // Page State
  const valistCtx = useContext(ValistContext);
  const accountNames = useAppSelector(selectAccountNames);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [formView, setFormView] = useState('Basic Info');

  // Account State
  const accountUsername = useAppSelector(selectUsername);
  const accountDisplayName = useAppSelector(selectDisplayName);
  const accountDescription = useAppSelector(selectDescription);
  const accountWebsite = useAppSelector(selectWebsite);
  const accountBeneficiary = useAppSelector(selectBeneficiary);
  const accountMembers = useAppSelector(selectMembers);

  const [accountImage, setTeamImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [accountMembersParsed, setTeamMembersParsed] = useState<Member[]>([]);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // Normalize accountMember data for AccountPreview component
  useEffect(() => {
    const members:Member[] = [];
    for (const accountMember of accountMembers) {
      members.push({
        id: accountMember,
      });
    }
    setTeamMembersParsed(members);
  }, [accountMembers]);

  // If props.accountName, render current account values, else clear values
  useEffect(() => {
    (async () => {
      let accountData;
      dispatch(clear());
      
      if (props.accountUsername) {
        try {
          dispatch(setUsername(props.accountUsername));
          accountData = await valistCtx.getTeamMeta(props.accountUsername);
          if (accountData.image) setCurrentImage(accountData.image);
          if (accountData.name) dispatch(setDisplayName(accountData.name));
          if (accountData.external_url) dispatch(setWebsite(accountData.external_url));
          if (accountData.description) dispatch(setDescription(accountData.description));
        } catch (err) {
          console.log('err', err);
        }
      }
    })();
  }, [dispatch, props.accountUsername, valistCtx.getTeamMeta]);

  // Wrap Valist Sdk call for create team
  const createTeam = async () => {
    let imgURL = "";

    if (accountImage) {
      imgURL = await valistCtx.writeFile(accountImage);
    } else {
      imgURL = currentImage;
    }

    const meta = {
      image: imgURL,
      name: accountDisplayName,
      description: accountDescription,
      external_url: accountWebsite,
    };

    console.log("Beneficiary", accountBeneficiary);
    console.log("Account Username", accountUsername);
    console.log("Account Members", accountMembers);
    console.log("Meta", meta);

    let toastID = '';
    try { 
      toastID = notify('pending');

      // If props.teamName call setTeamMeta else createTeam
      let transaction: any;
      if (props.accountUsername) {
        const updatedMeta = await valistCtx.writeJSON(JSON.stringify(meta));
        transaction = await valistCtx.setTeamMetaURI(accountUsername, updatedMeta);
      } else {
        transaction = await valistCtx.createTeam(
          accountUsername,
          meta,
          accountBeneficiary,
          accountMembers,
        );
      }
      
      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      // Inject created account/team into global state
      dispatch(setAccountNames([...accountNames, accountDisplayName]));
      dispatch(setTeam(accountUsername));

      dismiss(toastID);
      notify('success');

      if (!props.accountUsername) {
        router.push('/create/project');
      }
     
    } catch(err) {
      dismiss(toastID);
      notify('error', parseError(err));
    }
  };

  const PageTabs = [
    {
      text: 'Basic Info',
      disabled: false,
    },
  ];

  if (!props.accountUsername) PageTabs.push(    { 
    text: 'Members',
    disabled: false,
  });

  return (
    <div>
      <div className='border-b mb-4'>
        <Tabs setView={setFormView} view={formView} tabs={PageTabs} />
      </div>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
          <div className="p-4">
            <CreateTeamForm
              edit={props.accountUsername ? true : false}
              submitText={props.accountUsername ? 'Save changes' : 'Create team'}
              view={formView}
              teamUsername={accountUsername}
              teamDisplayName={accountDisplayName} 
              teamMembers={accountMembers} 
              teamDescription={accountDescription}
              teamBeneficiary={accountBeneficiary}
              teamWebsite={accountWebsite}   
              setImage={setTeamImage}
              submit={createTeam}        
            />
          </div>
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <TeamPreview
            view={formView}
            accountDescription={accountDescription}
            accountDisplayName={accountDisplayName}
            accountUsername={accountUsername}
            accountImage={accountImage}
            accountMembers={accountMembersParsed}
            defaultImage={currentImage}
          />
        </div>
      </div>
    </div>
  );
};