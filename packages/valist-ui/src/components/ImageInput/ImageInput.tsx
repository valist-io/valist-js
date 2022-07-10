import { Center, Image } from '@mantine/core';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React, { useEffect, useState } from 'react';
import * as Icon from 'tabler-icons-react';

interface ImageInputProps {
  onChange: (file: File) => void;
  value?: File;
  src?: string;
  width?: number | string;
  height?: number | string;
  disabled?: boolean;
  openRef?: React.ForwardedRef<() => void | undefined>;
}

export function ImageInput(props: ImageInputProps) {
  const { width, height } = props;
  const [src, setSrc] = useState<string>(null);

  // update image src when value changes
  useEffect(() => {
    if (props.value) {
      setSrc(URL.createObjectURL(props.value));
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
    <Dropzone
      style={{ width, height, padding: 0, border: '2px dashed #ced4da' }}
      onDrop={onDrop}
      accept={IMAGE_MIME_TYPE}
      openRef={props.openRef}
      disabled={props.disabled}
    >
      {(status) => 
        <Center style={{ height: '100%' }}>
          { (src || props.src)
            ? <Image fit="contain" width="100%" height="100%" radius="sm" src={src ?? props.src} />
            : <Icon.Photo color={'#9595A8'} size={64} />
          }
        </Center>
      }
    </Dropzone>
	);
}

ImageInput.defaultProps = {
  width: 300,
  height: 300,
}