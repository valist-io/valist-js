/* eslint-disable @next/next/no-img-element */
import { Member } from "../../utils/Apollo/types";
import ProjectContent from "./ProjectProfileContent";
import ProjectGallery, { Asset } from "./ProjectGallery";
import ProjectProfileCard from "./ProjectProfileCard";
import ProjectMetaCard from "./ProjectMetaCard";
import ProjectMemberList from "./ProjectMemberList";
import ProjectListCard from "./ProjectListCard";
import { useEffect, useState } from "react";
import { FileWithPath } from "file-selector";
import DicoveryItem from "../discovery/DiscoveryItem";
import { getYouTubeEmbedURL, getYouTubeID } from "../../utils/Youtube";
import { FileList } from "@/components/Files/FileUpload";

interface ProjectPreviewProps {
  projectAccount: string;
  projectDisplayName: string;
  projectImage: FileWithPath | null;
  projectShortDescription: string;
  projectDescription: string;
  projectWebsite: string;
  projectMembers: Member[];
  projectGallery: FileList[];
  projectAssets: Asset[];
  mainImage: FileWithPath | null;
  defaultImage?: string;
  youtubeUrl?: string;
  view: string;
  removeMember?: (address:string) => Promise<void>;
}

export default function ProjectPreview(props: ProjectPreviewProps) {
  const name = props.projectDisplayName || 'name';
  const description = props.projectDescription || '# Readme Not Found';
  const [imgUrl, setImgUrl] = useState<string>('');
  const [youtubeEmbed, setYotubeEmbed] = useState<string>('');
  const [mainImgUrl, setMainImgUrl] = useState('');
  const [galleryAssets, setGalleryAssets] = useState<Asset[]>([]);
  const _gallery = (galleryAssets.length !== 0) ? galleryAssets : props.projectAssets;

  useEffect(() => {
    if (props.projectImage) {
      setImgUrl(URL.createObjectURL(props.projectImage));
    }
  }, [props.projectImage]);

  useEffect(() => {
    if (props.mainImage) {
      setMainImgUrl(URL.createObjectURL(props.mainImage));
    }
  }, [props.mainImage]);

  useEffect(() => {
    if (props.youtubeUrl) {
      const id = getYouTubeID(props.youtubeUrl);
      if (id) {
        const youtubeUrl = getYouTubeEmbedURL(id);
        setYotubeEmbed(youtubeUrl);
      }
    }
  }, [props.youtubeUrl]);

  useEffect(() => {
    const assets: Asset[] = [];
    if (props.youtubeUrl && youtubeEmbed) {
      assets.push({
        src: youtubeEmbed,
        type: 'youtube',
        name: 'YouTube',
      });
    }

    props.projectGallery.map((item) => {
      if (typeof item.src === "object") {
        const url = URL.createObjectURL(item.src);
        assets.push(
          {
            src: url,
            type: item.src.type,
            name: item.src.name,
          },
        );
      } else {
        assets.push(
          {
            src: item.src,
            type: item.type,
            name: item.name,
          },
        );
      }
    });
    setGalleryAssets(assets);
  }, [props.projectGallery, props.youtubeUrl, youtubeEmbed]);

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
          projectMeta={{
            name: name,
            description,
          }}
          members={props.projectMembers}
          projectName={name}
          projectReleases={[]}
          releaseMeta={{}} 
          logs={[]}        
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
        return (
          <div>
            {mainImgUrl &&
              <div className="mb-2"> 
                <DicoveryItem 
                  text={'main-image'} 
                  image={mainImgUrl}             
                />
              </div>
            }
            <ProjectGallery assets={_gallery} />
          </div>
        );
      case 'Members':
        return <ProjectMemberList removeMember={props.removeMember} members={props.projectMembers} />;
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