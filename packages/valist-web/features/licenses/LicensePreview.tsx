/* eslint-disable @next/next/no-img-element */
interface LicensePreviewProps {
  licenseTeam: string,
  licenseProject: string,
  licenseName: string,
  licenseImage: File | null,
  licenseDescription: string,
}

export default function LicensePreview(props: LicensePreviewProps) {
  let imgUrl = "";
  if (props.licenseImage) {
    imgUrl = URL.createObjectURL(props.licenseImage);
  }

  return (
    <div className="w-full rounded overflow-hidden bg-white shadow-lg mt-4 mx-auto pb-8 w-80">
      <img className="w-full max-h h-80" src={(imgUrl !== '') ? imgUrl : '/images/vCentered.png'} alt="release-image" />
      <div className="px-6 pt-4 max-h-26">
        <div className="font-bold text-xl mb-2">{`${props.licenseTeam}/${props.licenseProject}:${props.licenseName}`}</div>
        <p className="max-h-24 text-gray-700 text-base overflow-hidden text-wrap break-normal">
          {props.licenseDescription}
        </p>
      </div>
    </div>
  );
}