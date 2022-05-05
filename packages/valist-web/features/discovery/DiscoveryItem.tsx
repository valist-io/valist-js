/* eslint-disable @next/next/no-img-element */
interface DiscoveryItemProps {
  text: string;
  image: string;
  price?: string;
}

export default function DicoveryItem(props:DiscoveryItemProps):JSX.Element {
  return (
    <div style={{ maxWidth: 616 }} className="bg-black rounded-md">
      <div className="flex items-center" style={{ height: 353, maxWidth: 616 }}>
        <img           
          className="mx-auto"
          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} 
          alt={props.text} 
          src={props.image} 
        />
      </div>
      <div className="bg-gray-700 h-16 p-4 flex justify-between">
        <p className="my-auto text-white font-bold">{props.text}</p>
        {props.price &&
          <div className="px-4 py-1 my-auto text-white border border-white rounded-md">
            {props.price}
          </div>
        }
      </div>
    </div>
  );
};