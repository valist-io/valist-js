import { Fragment } from "react";
import ProjectMemberList from "../projects/ProjectMemberList";
import TeamListCard from "./AccountListCard";
import TeamProfileCard from "./AccountProfileCard";

type AccountMember = {
  id: string;
}

interface AccountPreviewProps {
  view: string;
  accountUsername: string;
  accountDisplayName: string;
  accountImage: File | null;
  accountDescription: string;
  defaultImage?: string;
  accountMembers: AccountMember[];
  removeMember?: (address:string) => Promise<void>;
}

export default function AccountPreview(props: AccountPreviewProps) {
  const displayName = props.accountDisplayName || 'Display Name';
  const descripton = props.accountDescription || 'An example description';
  
  let imgUrl = "";
  if (props.accountImage) {
    imgUrl = URL.createObjectURL(props.accountImage);
  }

  const BasicInfoPreview = () => {
    return (
      <div>
        <TeamProfileCard 
          view={"Profile"}
          tabs={[{ text: 'Profile', disabled: false }]} 
          setView={() => {}}
          teamName={displayName} 
          teamImage={imgUrl || (props.defaultImage ? props.defaultImage : '')}
          meta={{
            image: "",
            name: "",
            description: descripton,
            external_url: "",
          }}
        />

        <br/>
  
        <TeamListCard text={descripton} image={imgUrl} teamName={displayName} metaURI={""} />
      </div>
    );
  };

  const AccountPreviewContent = () => {
    switch (props.view) {
      case 'Basic Info':
        return (
          <BasicInfoPreview />
        );
      case 'Members':
        return <ProjectMemberList removeMember={props.removeMember} members={props.accountMembers} />;
      default:
        return <Fragment />;
    }
  };

  return (
    <div>
      <div className="mt-4">
        {AccountPreviewContent()}
      </div>
    </div>
  );
}