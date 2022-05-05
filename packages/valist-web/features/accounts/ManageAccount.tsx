import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ValistContext from '../valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectLoginTried, selectLoginType, setAccountNames } from '../accounts/accountsSlice';
import { showLogin } from '../modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import { selectDescription, selectWebsite, selectMembers, setWebsite, setDescription, setDisplayName, clear, selectUsername, setUsername, selectDisplayName, setMembers } from './teamSlice';
import parseError from '../../utils/Errors';
import TeamPreview from './AccountPreview';
import CreateTeamForm from './AccountForm';
import Tabs from '../../components/Tabs';
import { BigNumber } from 'ethers';
import getConfig from 'next/config';
import { generateID } from '@valist/sdk';
import { setAccount } from '../projects/projectSlice';
import { FileList } from '@/components/Files/FileUpload';
import { useListState } from '@mantine/hooks';

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
  const { publicRuntimeConfig } = getConfig();

  // Account State
  const accountUsername = useAppSelector(selectUsername);
  const accountDisplayName = useAppSelector(selectDisplayName);
  const accountDescription = useAppSelector(selectDescription);
  const accountWebsite = useAppSelector(selectWebsite);
  const accountMembers = useAppSelector(selectMembers);

  const [accountID, setAccountID] = useState<string | null>(null);
  const [accountImage, setAccountImage] = useListState<FileList>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [accountMembersParsed, setAccountMembersParsed] = useState<Member[]>([]);
  const [membersChanged, setMembersChanged] = useState(0);

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

  // On initial page load, if in edit mode, set projectAccount
  useEffect(() => {
    console.log('props.accountsUsername', props.accountUsername);
    if (props.accountUsername) {
      dispatch(setUsername(props.accountUsername));
    }
  }, [props.accountUsername, accountNames, dispatch]);

  // If projectAccount, generate accountID
  useEffect(() => {
    if (accountUsername) {
      console.log('accountUserName', accountUsername);
      const chainID = BigNumber.from(publicRuntimeConfig.CHAIN_ID);
      const accountID = generateID(chainID, accountUsername);
      setAccountID(accountID.toString());
    }
  }, [accountUsername, publicRuntimeConfig.CHAIN_ID]);

  // If props.accountName, render current account values, else clear values
  useEffect(() => {
    (async () => {
      let accountData;
      if (props.accountUsername && valistCtx && accountID) {
        try {
          accountData = await valistCtx.getAccountMeta(accountID);
          if (accountData.image) setCurrentImage(accountData.image);
          if (accountData.name) dispatch(setDisplayName(accountData.name));
          if (accountData.external_url) dispatch(setWebsite(accountData.external_url));
          if (accountData.description) dispatch(setDescription(accountData.description));

          const members = await valistCtx.getAccountMembers(accountID);
  
          if (members) dispatch(setMembers(members));
        } catch (err) {
          console.log('err', err);
        }
      }
    })();
  }, [accountID, dispatch]);

  // Normalize accountMember data for AccountPreview component
  useEffect(() => {
    const members:Member[] = [];
    for (const accountMember of accountMembers) {
      members.push({
        id: accountMember,
      });
    }
    setAccountMembersParsed(members);
  }, [accountMembers]);

  // Wrap Valist Sdk call for create account
  const createAccount = async () => {
    if (!accountID || !valistCtx) return;
    let imgURL = "";

    if (accountImage.length > 0) {
      imgURL = await valistCtx.writeFile({
        // @ts-ignore
        path: accountImage[0].src.path,
        content: accountImage[0].src,
      });
    } else {
      imgURL = currentImage;
    }

    const meta = {
      image: imgURL,
      name: accountDisplayName,
      description: accountDescription,
      external_url: accountWebsite,
    };

    console.log("Account Username", accountUsername);
    console.log("Account Members", accountMembers);
    console.log("Meta", meta);

    let toastID = '';
    try { 
      toastID = notify('pending');

      // If props.accountName call setTeamMeta else createTeam
      let transaction: any;
      if (props.accountUsername) {
        transaction = await valistCtx.setAccountMeta(accountID, meta);
      } else {
        transaction = await valistCtx.createAccount(
          accountUsername,
          meta,
          accountMembers,
        );
      }
      
      dismiss(toastID);
      toastID = notify('transaction', transaction.hash);
      await transaction.wait();

      // Inject created account/account into global state
      dispatch(setAccountNames([...accountNames, accountUsername]));
      dispatch(setAccount(accountUsername));

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

  const addMember = async (address: string) => {
    console.log(`Adding ${address} to ${accountUsername}`);
    let toastID = '';
    let transaction;

    if (accountID && valistCtx) {
      try {
        toastID = notify('pending');
        console.log('accountUsername', accountUsername);
        console.log('address', address);
        transaction = await valistCtx.addAccountMember(accountID, address);
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
    console.log(`Removing ${address} from ${accountUsername}`);
    let toastID = '';
    let transaction: any;

    if (accountID && valistCtx) {
      try {
        toastID = notify('pending');
        transaction = await valistCtx.removeAccountMember(accountID, address);
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


  const PageTabs = [
    {
      text: 'Basic Info',
      disabled: false,
    },
    { 
      text: 'Members',
      disabled: false,
    },
  ];

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
              submitText={props.accountUsername ? 'Save changes' : 'Create account'}
              view={formView}
              accountID={accountID}
              accountUsername={accountUsername}
              accountDisplayName={accountDisplayName} 
              accountMembers={accountMembers} 
              accountDescription={accountDescription}
              accountWebsite={accountWebsite}  
              setView={setFormView} 
              setImage={setAccountImage}
              addMember={addMember}
              submit={createAccount}      
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
            accountImage={(accountImage[0] && typeof accountImage[0].src === 'object') ? accountImage[0].src : null}
            accountMembers={accountMembersParsed}
            defaultImage={currentImage}
            removeMember={removeMember}
          />
        </div>
      </div>
    </div>
  );
};