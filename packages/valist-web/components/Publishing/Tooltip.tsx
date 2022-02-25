import { InformationCircleIcon } from '@heroicons/react/solid';

interface TooltipProps {
  text: string
}

export default function Tooltip(props: TooltipProps): JSX.Element {
  return (
    <div>
      <div className='has-tooltip'>
        <span className='tooltip rounded shadow-lg bg-gray-700 border text-white p-2 -ml-10 -mt-10'>{props.text}</span>
        <InformationCircleIcon height={18} />
      </div>
    </div>);
}