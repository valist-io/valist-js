import React, { useState, useEffect } from 'react' ;
import { TextInput, Tooltip as MantineTooltip } from "@mantine/core";
import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';

import { setYouTubeUrl } from "../projectSlice";
import { getYouTubeID } from "../../../utils/Youtube";
import { UseListStateHandler } from "@mantine/hooks/lib/use-list-state/use-list-state";
import { useAppDispatch } from "../../../app/hooks";
import FileUpload, { FileList } from "../../../components/Files/FileUpload";




interface GraphicFormProps {
    galleryFiles: FileList[];
    youtubeUrl: string;
    setMainImage: UseListStateHandler<FileList>;
    setGallery: UseListStateHandler<FileList>;
  }
  
 export const GraphicsForm = (props: GraphicFormProps) => {
    const dispatch = useAppDispatch();
    const [validYouTube, setValidYouTube] = useState(true);
    const rightSectionTooltip =  (text:string) => {
      return (
        <MantineTooltip label= { text } >
          <AlertCircleIcon size={16} style={{ display: 'block', opacity: 0.5 }} />
       </MantineTooltip>
      );
    };
    const setYoutubeUrl = (url: string) => {
      if (getYouTubeID(url)) {
        dispatch(setYouTubeUrl(url));
        setValidYouTube(true);
      } else {
        dispatch(setYouTubeUrl(''));
        setValidYouTube(false);
      }
    };
    
    return (
      <div>
        <div className="mb-4">
          <FileUpload 
            setFiles={props.setMainImage}
            title={"Main Image (recommend 616px x 353px)"}
            files={[]}
            fileView={"none"} 
            multiple={false}    
          />
        </div>
        <div className="mb-2">
          <div className="mt-1">
            <TextInput
               id="youtube"
               name="youtube"
               onChange={(e) => setYoutubeUrl(e.target.value)}
               value={props.youtubeUrl}
               placeholder="YouTube URL"
               label= "YouTube URL"
               error={!validYouTube && "Invalid YouTube URL"}
               rightSection={rightSectionTooltip("Youtube Video")}
            />
          </div>
        </div>
        <div className="mb-4">
          <FileUpload
            setFiles={props.setGallery}
            title={"Screenshots & Videos (recommend 1280x720 or 1920x1080)"} 
            files={props.galleryFiles} 
            fileView={"ordered"}
            multiple={true}
          />
        </div>
      </div>
    );
  };