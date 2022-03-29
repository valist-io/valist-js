import React, { useRef, useState } from 'react';

interface AccordionProps {
  title: React.ReactNode
  children: React.ReactNode
  name: string,
}

export default function Accordion(props:AccordionProps) {
  const content = useRef(null);
  // @ts-ignore
  const [height, setHeight] = useState(`${content.current?.scrollHeight + 5 }px`);

  return (
    <div className="flex flex-col bg-white">
      <div
        className="py-6 px-6 border appearance-none focus:outline-none flex items-center justify-between"
      >
        <div className={'inline-block text-footnote'}>{props.title}</div>
      </div>
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
