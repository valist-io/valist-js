import { useState } from "react";
import TeamContent from "./TeamContent";
import TeamProfileCard from "./TeamProfileCard";

type TeamMember = {
  id: string
}

interface TeamPreviewProps {
  teamName: string,
  teamImage: File | null,
  teamDescription: string,
  teamMembers: TeamMember[],
  defaultImage?: string,
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
        tabs={[{ text: 'Projects', disabled: false }, { text: 'Members', disabled: false }]} 
        setView={setView}
        teamName={name} 
        teamImage={imgUrl || (props.defaultImage ? props.defaultImage : '')}
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