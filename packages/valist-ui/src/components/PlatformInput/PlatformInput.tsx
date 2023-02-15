import {FileButton as FButton, Flex, Input } from '@mantine/core';
import { ChangeEvent } from 'react';
import { FileCode, FileDigit } from 'tabler-icons-react';
import { Button } from '../Button';
import useStyles from './PlatformInput.styles';

interface PlatformInputProps {
  setFiles: (value: any) => void;
  setExecutable?: (value: string) => void;
  setInstallScript?: (value: string) => void;
  directory?: boolean;
}

export function PlatformInput(props: PlatformInputProps):JSX.Element {
  const { classes } = useStyles();

  if (!props.directory) {
    return (
      <Flex
        direction={"column"}
        gap="md"
      >
        <div style={{maxWidth: '42px'}}>
          <FButton onChange={(value) => props.setFiles([value])}>
            {(props) => <Button {...props}>Choose File</Button>}
          </FButton>
        </div>

        {
          props.setExecutable &&
          <Input
            icon={<FileDigit size={48} strokeWidth={2} color={'black'}/>}
            placeholder="Executable path (from build root directory)"
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setExecutable(e.target.value)}
          />
        }
        
        {
          props.setInstallScript &&
          <Input
            icon={<FileCode size={48} strokeWidth={2} color={'black'}/>}
            placeholder="Pre-install script path (optional)"
            onChange={(e: ChangeEvent<HTMLInputElement>) => props.setInstallScript(e.target.value)}
          />
        }
      </Flex>
    );
  };
  if (props.directory) {
    return (
      <>
        <input
          onChange={(e) => props.setFiles(Object.values(e.target.files))} 
          className={classes.hidden}
          type="file"
          id="files"
          /* @ts-expect-error */
          webkitdirectory="true" 
          mozdirectory="true"
        />
        <label className={classes.root} htmlFor="files">Choose Folder</label>
      </>
    );
  }
}