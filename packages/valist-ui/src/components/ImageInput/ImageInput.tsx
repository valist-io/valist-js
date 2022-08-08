import {
  AspectRatio,
  Center, 
  Image,
  Stack,
  Text,
} from '@mantine/core';

import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useElementSize } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import * as Icon from 'tabler-icons-react';

export interface ImageInputProps {
  onChange: (file: File) => void;
  value?: File | string;
  width?: number;
  height?: number;
  disabled?: boolean;
  openRef?: React.ForwardedRef<() => void | undefined>;
}

export function ImageInput(props: ImageInputProps) {
  const { ref, width, height } = useElementSize();
  const [src, setSrc] = useState<string>();

  useEffect(() => {
    if (typeof props.value === 'object') {
      setSrc(URL.createObjectURL(props.value));
    } else if (props.value) {
      setSrc(props.value as string);
    } else {
      setSrc(null);
    }
  }, [props.value]);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      props.onChange(files[0]);
    } else {
      props.onChange(null);      
    }
  };

	return (
    <AspectRatio 
      ref={ref} 
      ratio={props.width / props.height} 
      style={{ maxWidth: props.width }}
    >
      <Dropzone
        style={{ padding: 0, border: '2px dashed #ced4da' }}
        onDrop={onDrop}
        accept={IMAGE_MIME_TYPE}
        openRef={props.openRef}
        disabled={props.disabled}
      >
        {src && 
          <Image width={width} height={height} fit="contain" radius="sm" src={src} />
        }
        {!src &&
          <Stack align="center">
            <Icon.Photo color="#9595A8" size={64} />
            <Text color="#9595A8">Click or drag and drop to upload</Text>
          </Stack>
        }
      </Dropzone>
    </AspectRatio>
	);
}

ImageInput.defaultProps = {
  width: 300,
  height: 300,
}