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
  onChange: (files: File[]) => void;
  value?: File[];
}

export function GalleryInput(props: GalleryInputProps) {
  const { classes } = useStyles();
  
  const openRef = useRef<() => void>();
  const [index, setIndex] = useState(0);

  const files = props.value ?? [];
  const value = index < files.length
    ? files[index]
    : undefined;

  const update = (file: File) => {
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
    props.onChange(files.filter((_file, _index) => _index !== index));
  };

  return (
    <Stack>
      <ImageInput
        width={640}
        height={360}
        value={value} 
        onChange={update}
        openRef={openRef}
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
              <Image fit="contain" width="100%" height="100%" radius="sm" src={URL.createObjectURL(file)} />
            </UnstyledButton>
          </div>
        )}
        <UnstyledButton 
          className={classes.preview}
          onClick={() => add()}
        >
          <Center>
            <Icon.Plus size={32} color="#9595A8" />
          </Center>
        </UnstyledButton>
      </Group>
    </Stack>
  );
}