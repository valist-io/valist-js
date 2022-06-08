import { Paper } from "@mantine/core";
import { FileWithPath } from "react-dropzone";

/* eslint-disable @next/next/no-img-element */
interface ReleasePreviewProps {
  releaseTeam: string,
  releaseProject: string,
  releaseName: string,
  releaseImage: FileWithPath | null;
  releaseDescription: string,
}

export default function ReleasePreview(props: ReleasePreviewProps) {
  let imgUrl = "";
  if (props.releaseImage) {
    imgUrl = URL.createObjectURL(props.releaseImage);
  }

  return (
    <Paper shadow="xs" p="md" radius={"md"} withBorder style={{ paddingTop: 0, paddingLeft: 0, paddingRight: 0 }} className="overflow-hidden mt-4 mx-auto w-80">
      <img className="w-full max-h h-80" src={(imgUrl !== '') ? imgUrl : '/images/vCentered.png'} alt="release-image" />
      <div className="px-6 pt-4 max-h-26">
        <div className="font-bold text-xl mb-2">{`${props.releaseProject}:${props.releaseName}`}</div>
        <p className="max-h-24 text-gray-700 text-base overflow-hidden text-wrap break-normal">
          {props.releaseDescription}
        </p>
      </div>
    </Paper>
  );
}