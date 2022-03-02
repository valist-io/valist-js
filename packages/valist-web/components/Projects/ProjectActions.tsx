import { BigNumberish } from 'ethers';
import React, { useState, useRef, useEffect } from 'react';
import copyToCB from '../../utils/Clipboard';
import { ReleaseMeta } from '../../utils/Valist/types';
import DownloadLink from './DownloadLink';

interface ProjectActionsProps {
  teamName: string,
  projectName: string,
  releaseMeta: ReleaseMeta,
  licensePrice: BigNumberish | null,
  licenseBalance: Number,
  showAll: boolean,
  mintLicense: () => Promise<void>,
}

const ProjectActions = (props: ProjectActionsProps) => {
  const {
    teamName, projectName,
  } = props;

  const renderButton =  () => {
    if (props.licensePrice  === null || props.licenseBalance > 0) {
      return (
        <DownloadLink releaseName={`${teamName}_${projectName}`} releaseMeta={props.releaseMeta} />
      );
    } else if (props.licensePrice && props.licenseBalance === 0) {
      return (
        <div className="flex justify-center py-2 px-4 border border-transparent rounded-md 
         shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none 
         focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" onClick={() => props.mintLicense()}>
          Purchase License {props.licensePrice.toString()} MATIC
        </div>
      );
    }
  };

  return (
    <div className="rounded-lg bg-white shadow p-6">
      {renderButton()}
    </div>
  );
};

export default ProjectActions;
