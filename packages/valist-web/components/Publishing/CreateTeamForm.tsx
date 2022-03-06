import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import AccountContext from "../Accounts/AccountContext";
import ImageUpload from "../Images/ImageUpload";
import ValistContext from "../Valist/ValistContext";
import Tooltip from "./Tooltip";

interface CreateTeamFormProps {
  submitText: string,
  teamName: string,
  teamWebsite: string,
  teamMembers: string[],
  teamDescription: string,
  teamBeneficiary: string,
  setName: SetUseState<string>,
  setImage: SetUseState<File | null>,
  setDescription: SetUseState<string>,
  setWebsite: SetUseState<string>,
  setBeneficiary: SetUseState<string>,
  setMembers: SetUseState<string[]>,
  submit: () => void
}

export default function CreateTeamForm(props: CreateTeamFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);

  const [memberText, setMemberText] = useState<string>('');
  const [nameStyle, setNameStyle] = useState<string>(normalStyle);
  const [memberStyle, setMemberStyle] = useState<string>(normalStyle);
  const [beneficiaryStyle, setBeneficiaryStyle] = useState<string>(normalStyle);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const cleanedName = name.toLowerCase().replace(shortnameFilterRegex, '');
    props.setName(cleanedName);

    (async () => {
      if (cleanedName?.length > 0 && !(await checkTeamName(cleanedName))) {
        setNameStyle(normalStyle);
      } else {
        setNameStyle(errorStyle);
      }
    })();

  }, [name]);


  const debounce = <F extends ((...args: any) => any)>(func: F, waitFor: number) => {
    let timeout: number = 0;

    const debounced = (...args: any) => {
        clearTimeout(timeout);
        setTimeout(() => func(...args), waitFor);
    };
    
    return debounced as (...args: Parameters<F>) => ReturnType<F>;
  };
  
  const checkTeamName = async (teamName: string) => {
    try {
      await valistCtx.contract.getTeamMetaURI(teamName);
    } catch (err: any) {
      if (err?.data?.message.includes("execution reverted: err-team-not-exist")) {
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    let err = false;
    if (props.teamName === '' || props.teamName === ' ') {
      err = true;
      accountCtx.notify('error', 'Please enter a valid team name.');
      setNameStyle(errorStyle);
    }

    if (!ethers.utils.isAddress(props.teamBeneficiary)) {
      err = true;
      accountCtx.notify('error', 'Invalid address format');
      setBeneficiaryStyle(errorStyle);
    }

    if (memberText === '' || memberText === ' ') {
      err = true;
      accountCtx.notify('error', 'Please add atleast 1 valid member address');
      setMemberStyle(errorStyle);
      return;
    }

    if (err == true) return;
    props.submit();
  };

  const handleBeneficiaryChange = (text: string) => {
    if (ethers.utils.isAddress(text)) {
      setBeneficiaryStyle(normalStyle);
    } else {
      setBeneficiaryStyle(errorStyle);
    }

    props.setBeneficiary(text);
  };

  const handleMembersList = (text:string) => {
    setMemberText(text);
    setMemberStyle(normalStyle);
    const membersList = text.split('\n');
    let members: string[] = [];
    for (const member of membersList) {
      if (member !== '') {
         members.push(member);
      }
    }
    props.setMembers(members);
  };
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload text={'Set Image'} setImage={props.setImage} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Username <span className="float-right"><Tooltip text='The namespace for your team or account.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            placeholder={'Name'}
            onChange={(e) => setName(e.target.value)}
            value={props.teamName}
            required
            className={`${nameStyle} appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your team or account's website." /></span>
        </label>
        <div className="mt-1">
          <input
            id="website"
            name="website"
            type="text"
            onChange={(e) => props.setWebsite(e.target.value)}
            placeholder='Website URL'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='A short description about the team or account.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => props.setDescription(e.target.value)}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={'An example description'}
            defaultValue={''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
          Beneficiary Address<span className="float-right"><Tooltip text='The ETH address where license or donation funds will be received.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="beneficiary"
            name="beneficiary"
            type="text"
            onChange={(e) => handleBeneficiaryChange(e.target.value)}
            placeholder='Address'
            required
            className={`${beneficiaryStyle} appearance-none block w-full px-3 py-2 border 
            rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 sm:text-sm`}
          />
        </div>
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Member Addresses <span className="float-right"><Tooltip text='A list of members seperated by new-line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            rows={4}
            onChange={(e) => handleMembersList(e.target.value)}
            className={`${memberStyle} shadow-sm mt-1 block 
            w-full sm:text-sm border rounded-md`}
            placeholder="List of members"
            defaultValue={''}
          />
        </div>
      </div>

      <span className="w-full inline-flex rounded-md shadow-sm">
        <button onClick={handleSubmit} value="Submit" type="button" className="w-full inline-flex items-center
        justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium
        rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition
        ease-in-out duration-150">
            {props.submitText}
        </button>
      </span>
    </form>
  );
}