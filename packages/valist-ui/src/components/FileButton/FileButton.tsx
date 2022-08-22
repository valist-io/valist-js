import {FileButton as FButton } from '@mantine/core';
import { Button } from '../Button';

interface FileButtonProps {
  setFiles: (value:any) => void;
}

export function FileButton(props: FileButtonProps):JSX.Element {
  return (
    <FButton onChange={props.setFiles}>
      {(props) => <Button {...props}>Choose File</Button>}
    </FButton>
  );
}