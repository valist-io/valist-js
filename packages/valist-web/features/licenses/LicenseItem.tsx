/* eslint-disable @next/next/no-img-element */

interface LicenseItemProps {
  imgUrl: string,
  name: string,
  team: string,
  project: string,
  description: string,
}

export default function LicenseItem(props: LicenseItemProps) {
  return (
    <div className="overflow-hidden bg-white shadow-lg pb-4 border-2 hover:border-indigo-500 cursor-pointer">
      <div className="flex-shrink-0 mx-auto overflow-hidden" style={{ height: 250 }}>
        <img src={(props.imgUrl !== '') ? props.imgUrl : '/images/ValistLogo128.png'} alt="license-image" />
      </div>
      <div className="px-6 pt-2 max-h-26">
        <div className="font-bold text-xl mb-2">
          {props.name}
        </div>
        <div className="text-sm font-semibold">
          {props.project}@0.0.1
        </div>
      </div>
    </div>
  );
}