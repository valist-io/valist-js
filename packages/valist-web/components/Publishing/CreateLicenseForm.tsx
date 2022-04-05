import { useContext, useEffect, useState } from "react";
import { BigNumberish, ethers } from "ethers";
import { SetUseState } from "../../utils/Account/types";
import { versionFilterRegex } from "../../utils/Validation";
import ImageUpload from "../Images/ImageUpload";
import Tooltip from "./Tooltip";

import ValistContext from "../Valist/ValistContext";

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
  setPrice: SetUseState<BigNumberish>,
  setDescription: SetUseState<string>,
  submit: () => void
}

export default function CreateLicenseForm(props: CreateLicenseFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

  const valistCtx = useContext(ValistContext);

  const [name, setName] = useState<string>('');
  const [cleanName, setCleanName] = useState<string>('');

  const [price, setPrice] = useState<string>('0');

  const [validName, setValidName] = useState<boolean>(false);
  const [validForm, setValidForm] = useState<boolean>(false);


  const handleSubmit = async () => {
    if (validForm) {
      alert(`
Confirmation: You are about to create "${props.licenseName}" with the following details:

Team name: ${props.licenseTeam}
Project name: ${props.licenseProject}
License name: ${props.licenseName}
`);
      props.submit();
    }
  };

  useEffect(() => {
    try {
      const priceInWei = ethers.utils.parseEther(price || '0');
      props.setPrice(priceInWei);
    } catch (err) {
      console.log('Invalid number for price');
    }
  }, [price]);

  useEffect(() => {
    const checkLicenseName = async (licenseName: string) => {
      try {
        await valistCtx.getLicenseMetaURI(props.licenseTeam, props.licenseProject, licenseName);
      } catch (err: any) {
        if (JSON.stringify(err).includes("err-license-not-exist")) {
          return false;
        }
      }
      return true;
    };
    (async () => {
      let isNameTaken = name?.length > 0 && await checkLicenseName(name);
      setValidName(!isNameTaken);
      props.setName(name);
    })();
  }, [name, props.licenseTeam, props.licenseProject, valistCtx]);

  // Handle form valid check
  useEffect(() => {
    if (name && validName && price) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [name, validName]);

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload setImage={props.setImage} text={'Set License Image'} />
      <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium
        text-gray-700">
          Team <span className="float-right"><Tooltip text='The team where this license will be published.' /></span>
        </label>
        <select onChange={(e) => {props.setTeam(e.target.value);}}
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
        <select onChange={(e) => {props.setProject(e.target.value);}}
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
          License name <span className="float-right"><Tooltip text='The license name/tag.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            onChange={(e) => setCleanName(e.target.value.toLowerCase().replace(versionFilterRegex, ''))}
            onBlur={(e) => setName(e.target.value.toLowerCase().replace(versionFilterRegex, ''))}
            value={cleanName}
            required
            className={`${validName ? normalStyle : !cleanName ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
            placeholder="License name"
          />
        </div>
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Price (in MATIC)  <span className="float-right"><Tooltip text='The price to mint/purchase the license in MATIC. ERC-20 payments coming soon!' /></span>
        </label>
        <div className="mt-1">
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            onChange={(e) => setPrice(e.target.value.toString())}
            value={price}
            required={true}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm"
            placeholder="0.00"
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
        <button onClick={handleSubmit} value="Submit" type="button" className={`
        w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium
        rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition
        ease-in-out duration-150
        ${validForm ?
          'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
          'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
        }`}>
            Create License
        </button>
      </span>
    </form>
  );
}