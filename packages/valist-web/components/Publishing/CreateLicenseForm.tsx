import { SetUseState } from "../../utils/Account/types";
import ImageUpload from "../Images/ImageUpload";
import Tooltip from "./Tooltip";

interface CreateLicenseFormProps {
  teamNames: string[],
  projectNames: string[],
  licenseTeam: string,
  licenseProject: string,
  licenseName: string,
  setView: SetUseState<string>
  setImage: SetUseState<File | null>,
  setTeam: SetUseState<string>,
  setProject: SetUseState<string>,
  setName: SetUseState<string>,
  setDescription: SetUseState<string>,
  submit: () => void
}

export default function CreateLicenseForm(props: CreateLicenseFormProps) {
  const handleSubmit = async () => {
    if (props.licenseName === '' || props.licenseName === undefined) {
      alert("Please enter a valid license name.");
      return;
    }
    props.submit();
  };

  const handleTeamChange = (option: string) => {
    props.setTeam(option);
  };

  const handleProjectChange = (option: string) => {
    props.setProject(option);
  };

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload setImage={props.setImage} text={'Set License Image'} />
      <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium
        text-gray-700">
          Team <span className="float-right"><Tooltip text='The team where this license will be published.' /></span>
        </label>
        <select onChange={(e) => {handleTeamChange(e.target.value);}}
        id="projectType" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5">
          {props.teamNames.map((teamName: string) => (
            <option key={teamName} value={teamName}>{teamName}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium
        text-gray-700">
          Project <span className="float-right"><Tooltip text='The project where this license will be published.' /></span>
        </label>
        <select onChange={(e) => {handleProjectChange(e.target.value);}}
        id="projectType" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5">
          {props.projectNames.map((name: string) => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name <span className="float-right"><Tooltip text='The license name/tag.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            onChange={(e) => props.setName(e.target.value.toLowerCase())}
            required
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
            placeholder="License name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='Text describing the license (features, limitations, etc).' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => props.setDescription(e.target.value)}
            rows={4}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="License description"
          />
        </div>
      </div>

      <span className="w-full inline-flex rounded-md shadow-sm">
        <button onClick={handleSubmit} value="Submit" type="button" className="w-full inline-flex items-center
        justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium
        rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition
        ease-in-out duration-150">
            Create License
        </button>
      </span>
    </form>
  );
}