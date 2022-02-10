import { useState } from "react";
import TeamProfileCard from "../Teams/TeamProfileCard";
import TeamContent from "./TeamContent";

type TeamMember = {
  id: string
}

interface TeamPreviewProps {
  teamName: string,
  teamImage: string,
  teamDescription: string,
  teamMembers: TeamMember[],
}

export default function TeamPreview(props: TeamPreviewProps) {
  const [view, setView] = useState<string>("Projects");
  
  return (
    <div>
      <TeamProfileCard 
        view={view}
        tabs={['Projects', 'Members']} 
        setView={setView}
        teamName={props.teamName} 
        teamImage={props.teamImage}
        meta={{
          image: "",
          name: "",
          description: props.teamDescription,
          external_url: "",
        }}
      />
      <div className="mt-4">
       <TeamContent
        view={view}
        teamName={props.teamName} 
        description={props.teamDescription} 
        members={props.teamMembers} 
      />
      </div>
    </div>
  );
}