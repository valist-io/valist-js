import config from "next/config";
import { useState } from "react";
import { Member } from "../../utils/Apollo/types";
import ProjectProfileCard from "../Projects/ProjectProfileCard";
import ProjectContent from "./ProjectContent";

interface ProjectPreviewProps {
  teamName: string,
  projectName: string,
  projectImage: string,
  projectDescription: string,
  projectMembers: Member[],
}

export default function ProjectPreview(props: ProjectPreviewProps) {
  const { publicRuntimeConfig } = config();
  const [ view, setView ] = useState<string>("Readme");

  return (
    <div>
      <ProjectProfileCard 
        teamName={props.teamName} 
        projectName={props.projectName} 
        projectImg={props.projectImage}
        tabs={['Readme', 'Members']}
        view={view}
        setView={setView} />
      <div className="mt-4">
       <ProjectContent 
        view={view} 
        teamName={props.teamName} 
        description={props.projectDescription}
        members={props.projectMembers} />
      </div>
    </div>
  );
}