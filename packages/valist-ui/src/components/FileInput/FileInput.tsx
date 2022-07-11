import {
  Stack,
  Text,
  Group,
  ScrollArea,
} from '@mantine/core';

import { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import type { FileWithPath } from 'file-selector';
import * as Icon from 'tabler-icons-react';
import useStyles from './FileInput.styles';

export interface FileInputProps {
  onChange: (files: File[]) => void;
  value?: File[];
  disabled?: boolean;
}

export function FileInput(props: FileInputProps) {
  const { classes } = useStyles();

  return (
    <div className={classes.wrapper}>
      <Dropzone
        className={classes.dropzone}
        onDrop={props.onChange}
        disabled={props.disabled}
        multiple
      >
        {(status) => 
          <Stack align="center" justify="center" style={{ height: '100%' }}>
            <Icon.FileUpload color={'#9595A8'} size={64} />
            <Text color="dimmed">Click or drop files to upload.</Text>
          </Stack>
        }
      </Dropzone>
      {props.value && props.value.length > 0 &&
        <Stack className={classes.preview}>
          {props.value.map((file: FileWithPath) =>
            <Text key={file.path} className={classes.file}>{file.path}</Text>
          )}
        </Stack>
      }
    </div>
  );
}