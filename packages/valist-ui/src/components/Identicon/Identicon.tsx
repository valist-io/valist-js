import { Avatar, useMantineTheme } from '@mantine/core';
import { useRef, useEffect, useState } from 'react';
import { updateCanvas } from 'jdenticon';

export interface IdenticonProps {
  value: string;
  size?: number;
}

export function Identicon(props: IdenticonProps) {
  const ref = useRef(null);
  const theme = useMantineTheme();
  const [src, setSrc] = useState('');

  const backColor = theme.colors.gray[0];

  useEffect(() => {
    updateCanvas(ref.current, props.value, { backColor });
    setSrc(ref.current.toDataURL());  
  }, [props.value]);

  return (
     <>
      <canvas ref={ref} style={{ display: 'none' }} />
      <Avatar src={src} style={{ borderRadius: '50%' }} size={props.size} />
    </>
  );
};

Identicon.defaultProps = {
  size: 48,
}