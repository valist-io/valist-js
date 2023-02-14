import {FileButton as FButton } from '@mantine/core';
import { Button } from '../Button';
import useStyles from './FileButton.styles';

interface FileButtonProps {
  setFiles: (value:any) => void;
  directory?: boolean;
}

export function FileButton(props: FileButtonProps):JSX.Element {
  const { classes } = useStyles();

  if (!props.directory) {
    return (
      <FButton onChange={(value) => props.setFiles([value])}>
        {(props) => <Button {...props}>Choose File</Button>}
      </FButton>
    );
  };
  if (props.directory) {
    return (
      <>
        <input
          onChange={(e) => props.setFiles(Object.values(e.target.files))} 
          className={classes.hidden}
          style={{minHeight: '48px'}}
          type="file"
          id="files"
          /* @ts-expect-error */
          webkitdirectory="true" 
          mozdirectory="true"
        />
        <label style={{minHeight: '48px'}} className={classes.root} htmlFor="files">Choose Folder</label>
      </>
    );
  }
}