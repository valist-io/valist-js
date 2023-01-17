import {
  Stack,
  Group,
  Image,
  Center,
  ActionIcon,
  UnstyledButton,
} from '@mantine/core';

import { useState, useRef } from 'react';
import * as Icon from 'tabler-icons-react';
import { ImageInput } from '../ImageInput';
import useStyles from './GalleryInput.styles';

export interface GalleryInputProps {
  onChange: (files: (File | string)[]) => void;
  value?: (File | string)[];
  disabled?: boolean;
}

export function GalleryInput(props: GalleryInputProps) {
  const { classes } = useStyles();
  
  const openRef = useRef<() => void>();
  const [index, setIndex] = useState(0);

  const files = props.value ?? [];
  const value = index < files.length
    ? files[index]
    : undefined;

  const update = (file: File | string) => {
    if (index === files.length) {
      props.onChange([...files, file]);
    } else {
      props.onChange(files.map((_file, _index) => _index === index ? file : _file));
    }
  };

  const add = () => {
    setIndex(files.length);
    openRef.current();
  }

  const remove = (index: number) => {
    setIndex(index);
    console.log('newFiles', files.filter((_file, _index) => _index !== index));
    props.onChange(files.filter((_file, _index) => _index !== index));
  };

  const src = (file: File | string) => {
    if (typeof file === 'object') {
      return URL.createObjectURL(file);
    } else if (file) {
      return file as string;
    }
  };

  return (
    <Stack>
      <ImageInput
        width={640}
        height={360}
        value={value} 
        onChange={update}
        openRef={openRef}
        disabled={props.disabled}
      />
      <Group>
        {files.map((file: File, index: number) =>
          <div key={index} style={{ position: 'relative' }}>
            <ActionIcon 
              className={classes.remove}
              onClick={() => remove(index)}
            >
              <Icon.Trash size={18} color="#fff" />
            </ActionIcon>
            <UnstyledButton 
              className={classes.preview}
              onClick={() => setIndex(index)}
            >
              <Image fit="contain" width="100%" height="100%" radius="sm" src={src(file)} />
            </UnstyledButton>
          </div>
        )}
        <UnstyledButton 
          className={classes.preview}
          onClick={() => add()}
          disabled={props.disabled}
        >
          <Center>
            <Icon.Plus size={32} color="#9595A8" />
          </Center>
        </UnstyledButton>
      </Group>
    </Stack>
  );
}