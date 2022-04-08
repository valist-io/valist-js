import { Member } from "../../utils/Apollo/types";
import ProjectContent from "./ProjectProfileContent";
import ProjectGallery, { Asset } from "./ProjectGallery";
import ProjectProfileCard from "./ProjectProfileCard";
import ProjectMetaCard from "./ProjectMetaCard";
import ProjectMemberList from "./ProjectMemberList";
import ProjectListCard from "./ProjectListCard";
import { useEffect, useState } from "react";

interface ProjectPreviewProps {
  projectAccount: string;
  projectDisplayName: string;
  projectImage: File | null;
  projectShortDescription: string;
  projectDescription: string;
  projectWebsite: string;
  projectMembers: Member[];
  projectGallery: File[];
  projectAssets: Asset[];
  defaultImage?: string;
  view: string;
}

export default function ProjectPreview(props: ProjectPreviewProps) {
  const name = props.projectDisplayName || 'name';
  const description = props.projectDescription || '# Readme Not Found';
  const [imgUrl, setImgUrl] = useState('');
  const [galleryAssets, setGalleryAssets] = useState<Asset[]>([]);
  const _gallery = (galleryAssets.length !== 0) ? galleryAssets : props.projectAssets;

  useEffect(() => {
    if (props.projectImage) {
      setImgUrl(URL.createObjectURL(props.projectImage));
    }
  }, [props.projectImage]);

  useEffect(() => {
    const assets: Asset[] = [];

    props.projectGallery.map((item) => {
      console.log('fileInfo', item);
      const url = URL.createObjectURL(item);
      assets.push(
        {
          src: url,
          type: item.type,
          name: item.name,
        },
      );
    });

    setGalleryAssets(assets);
  }, [props.projectGallery]);

  const DescriptionsPreview = () => {
    return (
      <div>
        <ProjectListCard 
          teamName={props.projectAccount || 'Account Name'} 
          projectName={name}
          metaURI={""}
          image={imgUrl || props.defaultImage}
          text={props.projectShortDescription || 'Example Description'} 
        />

        <ProjectContent 
          view={'Readme'}
          teamName={props.projectAccount}
          projectMeta={
            {
              name: name,
              description,
            }
          }
          members={props.projectMembers} 
          projectName={name}
          projectReleases={[]} 
          releaseMeta={{}} 
        />
      </div>
    );
  };

  const ProjectPreviewContent = () => {
    switch (props.view) {
      case 'Basic Info':
        return (
          <BasicInfoPreview 
            projectAccount={props.projectAccount} 
            projectWebsite={props.projectWebsite} 
            projectMembers={props.projectMembers} 
            name={name}
            defaultImage={props.defaultImage} 
            imgUrl={imgUrl} 
            view={props.view} 
          />
        );
      case 'Descriptions':
        return  (
          <DescriptionsPreview />
        );
      case 'Graphics':
        return <ProjectGallery assets={_gallery} />;
      case 'Members':
        return <ProjectMemberList members={props.projectMembers} />;
      default:
        return (
          <ProjectProfileCard 
            teamName={props.projectAccount} 
            projectName={name}
            projectImg={imgUrl || (props.defaultImage ? props.defaultImage : '')}
            tabs={[{ text: 'Profile', disabled: false }]}
            view={'Profile'}
            setView={() => {}} 
          />
        );
    }
  };

  return (
    <div>
      <div className="mt-4">
        {ProjectPreviewContent()}
      </div>
    </div>
  );
}

interface BasicInfoPreviewProps {
  projectAccount: string,
  projectWebsite: string,
  projectMembers: Member[],
  defaultImage?: string,
  name: string;
  imgUrl: string;
  view: string,
}

const BasicInfoPreview = (props: BasicInfoPreviewProps) => {
  return (
    <div>
        <ProjectProfileCard 
          teamName={props.projectAccount} 
          projectName={props.name}
          projectImg={props.imgUrl || (props.defaultImage ? props.defaultImage : '')}
          tabs={[{ text: 'Profile', disabled: false }]}
          view={'Profile'}
          setView={() => {}} 
        />

        <br />

        <ProjectMetaCard 
          teamName={props.projectAccount} 
          projectName={""} 
          memberCount={props.projectMembers.length}
          version={"0.0.0"} 
          projectMeta={{
            external_url: props.projectWebsite,
          }} 
          donate={() => {}} 
        />
    </div>
  );
};