import React, { useEffect, useRef, useState } from 'react';
import { ChevronUpIcon } from '@heroicons/react/solid';
import { SetUseState } from '../../utils/Account/types';

interface AccordionProps {
  title: React.ReactNode
  children: React.ReactNode
  name: string,
  view: string,
  setView: SetUseState<string>
}

export default function Accordion(props:AccordionProps) {
  const active = (props.view === props.name);
  const content = useRef(null);
  // @ts-ignore
  const [height, setHeight] = useState(active ? `${content.current?.scrollHeight + 5 }px` : '0px');
  const [rotate, setRotate] = useState('transform duration-700 ease');

  function toggle() {
    if (!active) {
      // @ts-ignore
      setHeight(active ? '0px' : `${content.current?.scrollHeight + 5 }px`);
      setRotate(active ? 'transform duration-700 ease' : 'transform duration-700 ease rotate-180' );
      props.setView(active ? '' : props.name);
    }
  }

  useEffect(() => {
    // @ts-ignore
    setHeight(active ? `${content.current?.scrollHeight + 5 }px` : '0px');
    setRotate(active ? 'transform duration-700 ease' : 'transform duration-700 ease rotate-180' );
  }, [active]);

  return (
    <div className="flex flex-col bg-white">
      <button
        className="py-6 px-6 border appearance-none cursor-pointer focus:outline-none flex items-center justify-between"
        onClick={() => toggle()}
      >
        <div className={'inline-block text-footnote'}>{props.title}</div>
        <ChevronUpIcon  className={`${rotate} h-5 w-5 text-black inline-block`}/>
      </button>
      <div
        ref={content}
        style={{ maxHeight: `${height}` }}
        className="overflow-auto border transition-max-height duration-700 ease-in-out"
      >
        <div className="pb-5">
          {props.children}
        </div>
      </div>
    </div>
  );
}
