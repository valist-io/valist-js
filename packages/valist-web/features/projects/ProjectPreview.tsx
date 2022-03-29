import { useState } from "react";
import { Member } from "../../utils/Apollo/types";
import ProjectContent from "./ProjectContent";
import ProjectProfileCard from "./ProjectProfileCard";

interface ProjectPreviewProps {
  teamName: string,
  projectName: string,
  projectImage: File | null,
  projectDescription: string,
  projectMembers: Member[],
}

export default function ProjectPreview(props: ProjectPreviewProps) {
  const [ view, setView ] = useState<string>("Readme");
  const name = props.projectName || 'name';

  let imgUrl = "";
  if (props.projectImage) {
    imgUrl = URL.createObjectURL(props.projectImage);
  }

  let { projectDescription } = props;
  if (projectDescription === '') {
    projectDescription = '# Readme Not Found';
  }

  return (
    <div>
      <ProjectProfileCard 
        teamName={props.teamName} 
        projectName={name} 
        projectImg={imgUrl}
        tabs={[{ text: 'Readme', disabled: false }, { text: 'Members', disabled: false }]}
        view={view}
        setView={setView} />
      <div className="mt-4">
       <ProjectContent 
          view={view}
          teamName={props.teamName}
          projectMeta={
            {
              name: props.projectName,
              description: props.projectDescription,
            }
          }
          members={props.projectMembers} 
          projectName={props.projectName} 
          projectReleases={[]} 
          releaseMeta={{}} />
      </div>
    </div>
  );
}