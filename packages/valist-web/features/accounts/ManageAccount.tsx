import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ValistContext from '../valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectLoginTried, selectLoginType, setAccountNames } from '../accounts/accountsSlice';
import { showLogin } from '../modal/modalSlice';
import { selectDescription, selectWebsite, selectMembers, clear, selectUsername, setUsername, selectDisplayName, setMembers } from './teamSlice';
import AccountPreview from './AccountPreview';
import CreateAccountForm from './forms/AccountFormContent';
import Tabs from '../../components/Tabs';
import getConfig from 'next/config';
import { FileList } from '@/components/Files/FileUpload';
import { useListState } from '@mantine/hooks';
import { addMember, createOrUpdateAccount, removeMember } from '@/utils/Valist';
import { setAccount } from '../projects/projectSlice';
import { generateID } from '@valist/sdk';

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

  const [accountID, setAccountID] = useState<string>("");
  const [accountImage, setAccountImage] = useListState<FileList>([]);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [accountMembersParsed, setAccountMembersParsed] = useState<Member[]>([]);
  const [isDefaults, setIsDefaults] = useState<boolean>(false);
  const [membersChanged, setMembersChanged] = useState(0);
  const [initialValues, setInitialValues] = useState({
    username: "",
    displayName: "",
    description: "",
    website: "",
  });

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

  // If props.accountName, render current account values, else clear values
  useEffect(() => {
    (async () => {
      let accountData;
      if (props.accountUsername && router.isReady && valistCtx) {
        try {
          const _accountID = generateID(publicRuntimeConfig.CHAIN_ID, props.accountUsername);

          accountData = await valistCtx.getAccountMeta(_accountID);
          if (accountData.image) setCurrentImage(accountData.image);

          setInitialValues({
            username: props.accountUsername,
            displayName: accountData.name ? accountData.name : "",
            website: accountData.external_url ? accountData.external_url : "",
            description: accountData.description ? accountData.description : "",
          });

          const members = await valistCtx.getAccountMembers(_accountID);
          if (members) dispatch(setMembers(members));
          setIsDefaults(true);
        } catch (err) {
          console.log('err', err);
        }
      } else if (router.isReady) {
        setIsDefaults(true);
      }
    })();
  }, [accountID, dispatch, membersChanged]);

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

  const handleSubmit = (accountId: string, members: string[]) => {
    if (accountId) {
      createOrUpdateAccount(
        props.accountUsername ? false: true,
        accountUsername,
        accountId,
        accountDisplayName,
        accountDescription,
        accountWebsite,
        members,
        accountImage,
        currentImage,
        router,
        valistCtx,
        () => {
          // Inject created account/account into global state
          dispatch(setAccountNames([...accountNames, accountUsername]));
          dispatch(setAccount(accountUsername));
        },
      );
    }
  };

  const handleAddMember = async (address: string) => {
    if (address && accountID) {
      await addMember(
        address,
        accountUsername,
        accountID,
        valistCtx,
      );

      setMembersChanged(membersChanged + 1);
    }
  };

  const handleRemoveMember = (address: string) => {
    if (address && accountID) {
      removeMember(
        address,
        accountUsername,
        accountID,
        valistCtx,
      );
    }

    setMembersChanged(membersChanged + 1);
  };

  return (
    <div>
      <div className='mb-4'>
        <Tabs setView={setFormView} view={formView} tabs={PageTabs} />
      </div>
      <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
        {/* Left Column */}
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
          <div className="p-4">
            {(!props.accountUsername || isDefaults) && <CreateAccountForm
              initialValues={initialValues}
              edit={props.accountUsername ? true : false}
              submitText={props.accountUsername ? 'Save changes' : 'Create account'}
              view={formView}
              accountID={accountID}
              accountUsername={accountUsername}
              accountDisplayName={accountDisplayName} 
              accountMembers={accountMembers} 
              accountDescription={accountDescription}
              accountWebsite={accountWebsite} 
              setAccountID={setAccountID} 
              setView={setFormView} 
              setImage={setAccountImage}
              addMember={handleAddMember}
              submit={handleSubmit}   
            />}
          </div>
        </div>
        {/* Right column */}
        <div className="grid grid-cols-1 lg:col-span-7 gap-4">
          <AccountPreview
            view={formView}
            accountDescription={accountDescription}
            accountDisplayName={accountDisplayName}
            accountUsername={accountUsername}
            accountImage={(accountImage[0] && typeof accountImage[0].src === 'object') ? accountImage[0].src : null}
            accountMembers={accountMembersParsed}
            defaultImage={currentImage}
            removeMember={handleRemoveMember}
          />
        </div>
      </div>
    </div>
  );
};