import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import ValistContext from '../../features/valist/ValistContext';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectAccountNames, selectLoginTried, selectLoginType, setAccountNames } from '../../features/accounts/accountsSlice';
import { showLogin } from '../../features/modal/modalSlice';
import { dismiss, notify } from '../../utils/Notifications';
import { setTeam } from '../../features/projects/projectSlice';
import { selectName, selectDescription, selectWebsite, selectBeneficiary, selectMembers, setWebsite, setDescription, setName } from '../../features/teams/teamSlice';
import parseError from '../../utils/Errors';
import Accordion from '../../components/Accordian/Accordion';
import TeamPreview from '../../features/teams/TeamPreview';
import CreateTeamForm from '../../features/teams/CreateTeamForm';
import { TransactionAPI } from '@valist/sdk/dist/contract';

type Member = {
  id: string,
}

interface EditTeamProps {
  teamName?: string,
}

export default function EditTeam(props: EditTeamProps) {
  // Page State
  const valistCtx = useContext(ValistContext);
  const accountNames = useAppSelector(selectAccountNames);
  const loginType = useAppSelector(selectLoginType);
  const loginTried = useAppSelector(selectLoginTried);
  const dispatch = useAppDispatch();
  const router = useRouter();

  // Team State
  const teamName = useAppSelector(selectName);
  const teamDescription = useAppSelector(selectDescription);
  const teamWebsite = useAppSelector(selectWebsite);
  const teamBeneficiary = useAppSelector(selectBeneficiary);
  const teamMembers = useAppSelector(selectMembers);

  const [teamImage, setTeamImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string>('');
  const [teamMembersParsed, setTeamMembersParsed] = useState<Member[]>([]);

  // Check if user is authenticated, prompt them to login if not logged in
  useEffect(() => {
    (async () => {
      if (loginType === 'readOnly' && loginTried) {
        dispatch(showLogin());
      }
    })();
  }, [dispatch, loginTried, loginType]);

  // Normalize teamMember data for TeamPreview component
  useEffect(() => {
    const members:Member[] = [];
    for (const teamMember of teamMembers) {
      members.push({
        id: teamMember,
      });
    }
    setTeamMembersParsed(members);
  }, [teamMembers]);

  // If props.teamName, render current team values, else clear values
  useEffect(() => {
    (async () => {
      let teamData;
      if (props.teamName) {
        try {
          teamData = await valistCtx.getTeamMeta(props.teamName);
          if (teamData.image) setCurrentImage(teamData.image);
          if (teamData.name) dispatch(setName(teamData.name));
          if (teamData.external_url) dispatch(setWebsite(teamData.external_url));
          if (teamData.description) dispatch(setDescription(teamData.description));
        } catch (err) {
          console.log('err', err);
        }
      } else {
        dispatch(setName(''));
        dispatch(setWebsite(''));
        dispatch(setDescription(''));
      }
    })();
  }, [dispatch, props.teamName, valistCtx.getTeamMeta]);

  // Wrap Valist Sdk call for create team
  const createTeam = async () => {
    let imgURL = "";

    if (teamImage) {
      imgURL = await valistCtx.storage.writeFile(teamImage);
    } else {
      imgURL = currentImage;
    }

    const meta = {
      image: imgURL,
      name: teamName,
      description: teamDescription,
      external_url: teamWebsite,
    };

    console.log("Beneficiary", teamBeneficiary);
    console.log("Team Name", teamName);
    console.log("Team Members", teamMembers);
    console.log("Meta", meta);

    let toastID = '';
    try { 
      toastID = notify('pending');

      // If props.teamName call setTeamMeta else createTeam
      let transaction: TransactionAPI;
      if (props.teamName) {
        const updatedMeta = await valistCtx.storage.writeJSON(JSON.stringify(meta));
        transaction = await valistCtx.contract.setTeamMetaURI(teamName, updatedMeta);
      } else {
        transaction = await valistCtx.createTeam(
          teamName,
          meta,
          teamBeneficiary,
          teamMembers,
        );
      }
      
      dismiss(toastID);
      toastID = notify('transaction', transaction.hash());
      await transaction.wait();

      // Inject created account/team into global state
      dispatch(setAccountNames([...accountNames, teamName]));
      dispatch(setTeam(teamName));

      dismiss(toastID);
      notify('success');

      if (!props.teamName) {
        router.push('/create/project');
      }
     
    } catch(err) {
      dismiss(toastID);
      notify('error', parseError(err));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 items-start gap-y-6 lg:grid-cols-12 lg:gap-8">
      {/* Left Column */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 lg:col-span-5">
        <Accordion name={'team'} title={
          <div>
            <span className='mr-4'>
            </span>{props.teamName ? 'Edit' : 'Create a'} Team or Personal Account</div>
        }>
          <div className="p-4">
            <CreateTeamForm
              edit={props.teamName ? true : false}
              submitText={props.teamName ? 'Save changes' : 'Create team'}
              teamName={teamName} 
              teamMembers={teamMembers} 
              teamDescription={teamDescription}
              teamBeneficiary={teamBeneficiary}
              teamWebsite={teamWebsite}   
              setImage={setTeamImage}
              submit={createTeam}        
            />
          </div>
        </Accordion>
      </div>
      {/* Right column */}
      <div className="grid grid-cols-1 lg:col-span-7 gap-4">
        <TeamPreview
          teamDescription={teamDescription}
          teamName={teamName}
          teamImage={teamImage}
          teamMembers={teamMembersParsed}
          defaultImage={currentImage}
        />
      </div>
    </div>
  );
};