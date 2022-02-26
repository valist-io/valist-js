import React, { useState, useRef, useEffect } from 'react';
import copyToCB from '../../utils/Clipboard';

interface ProjectActionsProps {
  teamName: string,
  projectName: string,
  showAll: boolean,
}

const ProjectActions = (props: ProjectActionsProps) => {
  const [location, setLocation] = useState<string>('');
  const installRef = useRef(null);

  const {
    teamName, projectName,
  } = props;


  useEffect(() => {
    setLocation(window.location.toString());
  }, []);

  return (
    <div className="pb-4">
      <div className="pb-4">
        <h1 className="text-xl text-gray-900 mb-2">
          Download with cURL
        </h1>
        <div ref={installRef} className="col-span-12 flex bg-indigo-50 rounded-lg justify-between">
          <pre style={{ overflow: 'scroll' }} className="p-2 hide-scroll">
            <code>
              curl -Lo {projectName} {location}/api/{teamName}/{projectName}/latest
            </code>
          </pre>
          <div className="m-2" style={{ minHeight: '25px', minWidth: '25px' }}>
            <svg onClick={() => copyToCB(installRef)}
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 float-right cursor-pointer"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2
                      2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActions;
