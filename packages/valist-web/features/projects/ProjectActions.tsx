import { Fragment } from 'react';
import Link from "next/link";
import { Release } from "../../utils/Apollo/types";
import { ReleaseMeta } from '../../utils/Valist/types';
import { Paper } from '@mantine/core';

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
    if (Number(props.licensePrice) === 0 || props.licenseBalance !== 0) {
      return (
        <Link href={props.releaseMeta.external_url || ''} passHref>
          <a target="_blank" rel="noopener noreferrer">
            <div className="flex justify-center py-2 px-4 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">
              Launch
            </div>
          </a>
        </Link>
      );
    } else if (props.licensePrice && props.licenseBalance === 0) {
      return (
        <div className="flex justify-center py-2 px-4 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer" 
         onClick={() => props.mintLicense()}>
          Purchase License {props.licensePrice.toString()} MATIC
        </div>
      );
    }
  };

  return (
    <Fragment>
      {(props?.releases.length !== 0 ) &&
        <Paper shadow="xs" p="sm" withBorder>
          {renderButton()}
        </Paper>
      }
    </Fragment>
  );
};

export default ProjectActions;
