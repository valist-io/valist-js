import {
  AspectRatio, 
  Image,
  Stack,
  Text,
} from '@mantine/core';

import { Dropzone } from '@mantine/dropzone';
import { useElementSize } from '@mantine/hooks';
import React, { useEffect, useState } from 'react';
import * as Icon from 'tabler-icons-react';

const IMAGE_MIME_TYPE = ["image/png" || "image/gif" || "image/jpeg"];

export interface ImageInputProps {
  onChange: (value: any) => void;
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
      setSrc(undefined);
    }
  }, [props.value]);

  const onDrop = (files: File[]) => {
    if (files.length > 0) {
      props.onChange(files[0]);
    } else {
      props.onChange(undefined);      
    }
  };

	return (
    <AspectRatio 
      ref={ref} 
      ratio={(props.width || 16) / (props.height || 9)} 
      style={{ width: props.width, height: props.height }}
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
};