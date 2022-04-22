import { Fragment } from 'react';
import Link from "next/link";
import { Release } from "../../utils/Apollo/types";
import { ReleaseMeta } from '../../utils/Valist/types';

interface ProjectActionsProps {
  teamName: string;
  projectName: string;
  releases: Release[];
  releaseMeta: ReleaseMeta;
  licensePrice: string;
  licenseBalance: Number;
  showAll: boolean;
  mintLicense: () => Promise<void>;
}

const ProjectActions = (props: ProjectActionsProps) => {
  const renderButton =  () => {
    if (Number(props.licensePrice) === 0) {
      return (
        <Link href={`/${props.teamName}/${props.projectName}/${props.releases[0].name}`}>
          <div className="flex justify-center py-2 px-4 border border-transparent rounded-md 
           shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
           focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
            Launch
          </div>
        </Link>
      );
    } else if (props.licensePrice && props.licenseBalance === 0) {
      return (
        <div className="flex justify-center py-2 px-4 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer" 
         onClick={() => props.mintLicense()}>
          Purchase License {props.licensePrice.toString()} MATIC
        </div>
      );
    }
  };

  return (
    <Fragment>
       {(props?.releases.length !== 0 ) &&
          <div className="rounded-lg bg-white shadow p-6">
            {renderButton()}
          </div>
        }
    </Fragment>
  );
};

export default ProjectActions;
