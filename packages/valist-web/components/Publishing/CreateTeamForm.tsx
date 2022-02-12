import { SetUseState } from "../../utils/Account/types";
import ImageUpload from "../Images/ImageUpload";
import Tooltip from "./Tooltip";

interface CreateTeamFormProps {
  submitText: string,
  teamName: string,
  teamWebsite: string,
  teamMembers: string[],
  teamDescription: string,
  setName: SetUseState<string>,
  setImage: SetUseState<File | null>,
  setDescription: SetUseState<string>,
  setWebsite: SetUseState<string>,
  setBeneficiary: SetUseState<string>,
  setMembers: SetUseState<string[]>,
  submit: () => void
}

export default function CreateTeamForm(props: CreateTeamFormProps) {
  const handleSubmit = async () => {
    if (props.teamName === "" || props.teamName === "teamName") {
      alert("Please enter a valid team name!");
      return
    }

    if (props.teamDescription === "" || props.teamDescription === "An example team description.") {
      alert("Please enter a valid team description!");
      return
    }

    await props.submit()
  };

  const handleMembersList = (text:string) => {
    const membersList = text.split('\n');
    let members: string[] = []
    for (const member of membersList) {
      if (member !== '') {
         members.push(member);
      }
    }
    props.setMembers(members);
  }
  
  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload text={'Set Team Image'} setImage={props.setImage} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="float-right"><Tooltip text='The name of your team.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            placeholder={props.teamName}
            onChange={(e) => props.setName(e.target.value.toLowerCase())}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website <span className="float-right"><Tooltip text="The link to your team's website." /></span>
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
          Description <span className="float-right"><Tooltip text='A short sentence about your team.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => props.setDescription(e.target.value)}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder={props.teamDescription}
            defaultValue={''}
          />
        </div>
      </div>

      <div>
        <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">
          Beneficiary <span className="float-right"><Tooltip text='The ETH address where license or donation funds will be received.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="beneficiary"
            name="beneficiary"
            type="text"
            onChange={(e) => props.setBeneficiary(e.target.value)}
            placeholder='Address'
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="members" className="block text-sm font-medium text-gray-700">
          Members <span className="float-right"><Tooltip text='A list of team members seperated by new line.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="members"
            name="members"
            rows={4}
            onChange={(e) => handleMembersList(e.target.value)}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
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