import { useState } from "react";
import TeamProfileCard from "../Teams/TeamProfileCard";
import TeamContent from "./TeamContent";

type TeamMember = {
  id: string
}

interface TeamPreviewProps {
  teamName: string,
  teamImage: File | null,
  teamDescription: string,
  teamMembers: TeamMember[],
}

export default function TeamPreview(props: TeamPreviewProps) {
  const [view, setView] = useState<string>("Projects");
  
  let imgUrl = "";
  if (props.teamImage) {
    imgUrl = URL.createObjectURL(props.teamImage);
  }
  
  return (
    <div>
      <TeamProfileCard 
        view={view}
        tabs={['Projects', 'Members']} 
        setView={setView}
        teamName={props.teamName} 
        teamImage={imgUrl}
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