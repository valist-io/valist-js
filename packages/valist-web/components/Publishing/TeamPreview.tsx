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
  const name = props.teamName || 'name';
  const descripton = props.teamDescription || 'An example description';
  
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
        teamName={name} 
        teamImage={imgUrl}
        meta={{
          image: "",
          name: "",
          description: descripton,
          external_url: "",
        }}
      />
      <div className="mt-4">
       <TeamContent
        view={view}
        teamName={name} 
        description={descripton} 
        members={props.teamMembers} 
      />
      </div>
    </div>
  );
}