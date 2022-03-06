import { useContext, useEffect, useState } from "react";
import { SetUseState } from "../../utils/Account/types";
import { shortnameFilterRegex } from "../../utils/Validation";
import AccountContext from "../Accounts/AccountContext";
import ValistContext from "../Valist/ValistContext";
import ImageUpload from "../Images/ImageUpload";
import Tooltip from "./Tooltip";

interface CreateProjectFormProps {
  projectName: string,
  projectDescription: string,
  projectWebsite: string,
  userTeams: string[],
  setView: SetUseState<string>,
  setRenderTeam: SetUseState<boolean>,
  setName: SetUseState<string>,
  setImage: SetUseState<File | null>,
  setDescription: SetUseState<string>,
  setShortDescription: SetUseState<string>,
  setWebsite: SetUseState<string>,
  setMembers: SetUseState<string[]>,
  setTeam: SetUseState<string>,
  submit: () => void
}

export default function CreateProjectForm(props: CreateProjectFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';
  const accountCtx = useContext(AccountContext);
  const valistCtx = useContext(ValistContext);

  const [memberText, setMemberText] = useState<string>('');
  const [nameStyle, setNameStyle] = useState<string>(normalStyle);
  const [memberStyle, setMemberStyle] = useState<string>(normalStyle);
  const [teamName, setTeamName] = useState<string>(props.userTeams[0]);
  const [projectName, setProjectName] = useState<string>('');

  useEffect(() => {

    console.log(teamName, projectName)
    props.setTeam(teamName);

    const cleanedName = projectName.toLowerCase().replace(shortnameFilterRegex, '');
    props.setName(cleanedName);

    (async () => {
      if (cleanedName?.length > 0 && !(await checkProjectName(cleanedName))) {
        setNameStyle(normalStyle);
      } else {
        setNameStyle(errorStyle);
      }
    })();

  }, [teamName, projectName]);

  const checkProjectName = async (projectName: string) => {
    console.log(teamName, projectName)
    try {
      await valistCtx.contract.getProjectMetaURI(teamName, projectName);
    } catch (err: any) {
      if (err?.data?.message.includes("execution reverted: err-proj-not-exist")) {
        return false;
      }
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (props.projectName === '' || props.projectName === ' ') {
      accountCtx.notify('error', 'Please enter a valid project name.');
      setNameStyle(errorStyle);
      return;
    }

    if (memberText === '' || memberText === ' ') {
      accountCtx.notify('error', 'Please add atleast 1 valid member address');
      setMemberStyle(errorStyle);
      return;
    }

    props.submit();
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
      <ImageUpload setImage={props.setImage} text={"Set Project Image"} />
      <div>
          <label htmlFor="projectType" className="block text-sm leading-5 font-medium text-gray-700">
            Account or Team <span className="float-right"><Tooltip text='The team where this project will be published.' /></span>
          </label>
          <select onChange={(e) => {setTeamName(e.target.value);}}
            id="projectType" className="mt-1 form-select block w-full pl-3 pr-10 py-2
            text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
            focus:border-blue-300 sm:text-sm sm:leading-5">
            {props.userTeams?.map((teamName) => (
               <option key={teamName} value={teamName}>{teamName}</option>
            ))}
          </select>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="float-right"><Tooltip text='The name of your project.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            onChange={(e) => setProjectName(e.target.value)}
            value={props.projectName}
            required
            className={`${nameStyle} appearance-none block w-full px-3 py-2 border 
            rounded-md shadow-sm focus:outline-none sm:text-sm`}
            placeholder="Project name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your proejct's website." /></span>
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
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Short description <span className="float-right"><Tooltip text="A short description shown on searchs and previews of your project." /></span>
        </label>
        <div className="mt-1">
          <input
            id="shortDescription"
            name="shortDescription"
            type="text"
            onChange={(e) => props.setShortDescription(e.target.value)}
            placeholder='A short description'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='Plain text or markdown describing your project in detail.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => props.setDescription(e.target.value)}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="An extended description"
          />
        </div>
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Member Addresses <span className="float-right"><Tooltip text='A list of project members seperated by new-line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            onChange={(e) => handleMembersList(e.target.value)}
            rows={4}
            className={`${memberStyle} shadow-sm mt-1 block 
            w-full sm:text-sm border rounded-md`}
            placeholder="List of members"
          />
        </div>
      </div>

      <span className="w-full inline-flex rounded-md shadow-sm">
        <button onClick={handleSubmit} value="Submit" type="button" className="w-full inline-flex items-center
        justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium
        rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition
        ease-in-out duration-150">
            Create Project
        </button>
      </span>
    </form>
  );
}