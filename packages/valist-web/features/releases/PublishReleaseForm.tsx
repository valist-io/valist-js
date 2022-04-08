import { Fragment, useContext, useEffect, useState } from "react";
import { useAppDispatch } from "../../app/hooks";
import FileUpload from "../../components/Files/FileUpload";
import ImageUpload from "../../components/Images/ImageUpload";
import Tooltip from "../../components/Tooltip";
import { SetUseState } from "../../utils/Account/types";
import { versionFilterRegex } from "../../utils/Validation";
import ValistContext from "../valist/ValistContext";
import { setDescription, setLicenses, setName, setProject, setTeam } from "./releaseSlice";

interface PublishReleaseFormProps {
  teamNames: string[];
  projectNames: string[];
  releaseTeam: string;
  releaseProject: string;
  releaseName: string;
  releaseLicense: string;
  releaseLicenses: string[];
  releaseFiles: File[];
  setImage: SetUseState<File | null>;
  setFiles: SetUseState<File[]>;
  submit: () => void;
}

export default function PublishReleaseForm(props: PublishReleaseFormProps) {
  const errorStyle = 'border-red-300 placeholder-red-400 focus:ring-red-500 focus:border-red-500';
  const normalStyle = 'border-gray-300 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500';

  const valistCtx = useContext(ValistContext);
  const dispatch = useAppDispatch();

  const [_name, _setName] = useState<string>('');
  const [cleanName, setCleanName] = useState<string>('');

  const [validName, setValidName] = useState<boolean>(false);
  const [validForm, setValidForm] = useState<boolean>(false);

  const handleSubmit = async () => {
    if (validForm) {
      alert(`
Confirmation: You are about to publish "${props.releaseName}" with the following details:

Team name: ${props.releaseTeam}
Project name: ${props.releaseProject}
Version tag: ${props.releaseName}
${props.releaseLicense && `Release license: ${props.releaseLicense}` || ''}
`);
      props.submit();
    }
  };

  const handleLicenseList = (text: string) => {
    const licenses = [];
    if (text !== '') {
      licenses.push(text);
    }

    dispatch(setLicenses(licenses));
  };

  useEffect(() => {
    const checkReleaseName = async (releaseName: string) => {
      try {
        await valistCtx.getReleaseMetaURI(props.releaseTeam, props.releaseProject, releaseName);
      } catch (err: any) {
        if (JSON.stringify(err).includes("err-release-not-exist")) {
          return false;
        }
      }
      return true;
    };
    (async () => {
      let isNameTaken = _name?.length > 0 && await checkReleaseName(_name);
      setValidName(!isNameTaken);
      dispatch(setName(_name));
    })();
  }, [_name, dispatch, props.releaseProject, props.releaseTeam, valistCtx.getReleaseMetaURI]);

  // Handle form valid check
  useEffect(() => {
    if (_name && validName) {
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [_name, validName]);

  return (
    <form className="grid grid-cols-1 gap-y-6 sm:gap-x-8" action="#" method="POST">
      <ImageUpload setImage={props.setImage} text={'Set Release Image'} />
      <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium
        text-gray-700">
          Team <span className="float-right"><Tooltip text='The team where this release will be published.' /></span>
        </label>
        <select onChange={(e) => {dispatch(setTeam(e.target.value));} }
        id="projectType" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5">
          {props.teamNames.map((teamName: string) => (
            <Fragment key={teamName}>
              {
                (teamName === props.releaseTeam) ? 
                  <option selected={true} value={teamName}>{teamName}</option> : <option value={teamName}>{teamName}</option>
              }
            </Fragment>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium
        text-gray-700">
          Project <span className="float-right"><Tooltip text='The project where this release will be published.' /></span>
        </label>
        <select onChange={(e) => {dispatch(setProject(e.target.value));}}
        id="projectType" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5" value={props.releaseProject}>
          {props.projectNames.map((name: string) => (
            <Fragment key={name}>
              {
                (name === props.releaseProject) ? 
                  <option selected={true} value={name}>{name}</option> : <option value={name}>{name}</option>
              }
            </Fragment>
          ))}
        </select>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Version Tag <span className="float-right"><Tooltip text='The release name/tag.' /></span>
        </label>
        <div className="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            onChange={(e) => setCleanName(e.target.value.toLowerCase().replace(versionFilterRegex, ''))}
            onBlur={(e) => _setName(e.target.value.toLowerCase().replace(versionFilterRegex, ''))}
            value={cleanName}
            required
            className={`${validName ? normalStyle : !cleanName ? normalStyle : errorStyle}
            appearance-none block w-full px-3 py-2 border border-gray-300 
            rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 
            focus:border-indigo-500 sm:text-sm`}
            placeholder="1.0.3"
          />
        </div>
      </div>

      {(props.releaseLicenses.length !== 0) && <div>
        <label htmlFor="projectType" className="block text-sm leading-5 font-medium text-gray-700">
          License <span className="float-right"><Tooltip text='The associated release license.' /></span>
        </label>
        <select onChange={(e) => {handleLicenseList(e.target.value);}}
        id="license" className="mt-1 form-select block w-full pl-3 pr-10 py-2
        text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue
        focus:border-blue-300 sm:text-sm sm:leading-5" value={props.releaseLicense}>
          {props.releaseLicenses.map((licenseName: string) => (
            <option key={licenseName} value={licenseName}>{licenseName}</option>
          ))}
          <option value={''}>None</option>
        </select>
      </div>}

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description <span className="float-right"><Tooltip text='Text describing the changes in this release.' /></span>
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            onChange={(e) => dispatch(setDescription(e.target.value))}
            rows={3}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block 
            w-full sm:text-sm border border-gray-300 rounded-md"
            placeholder="Release description"
          />
        </div>
      </div>

      <FileUpload 
        files={props.releaseFiles}
        setFiles={props.setFiles}
      />

      <span className="w-full inline-flex rounded-md shadow-sm">
        <button onClick={handleSubmit} value="Submit" type="button" className={`w-full inline-flex items-center
        justify-center px-6 py-3 border border-transparent text-base leading-6 font-medium
        rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none
        focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150
        ${validForm ?
          'bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700' :
          'bg-indigo-200 hover:bg-indigo-200 focus:outline-none focus:shadow-outline-grey cursor-not-allowed'
        }`}>
            Publish Release
        </button>
      </span>
    </form>
  );
}