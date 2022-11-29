import { Text, Center } from '@mantine/core';

interface YesNoPromptProps {
  yes: () => void;
  no: () => void;
  text: string;
  yesText?: string;
  noText?: string;
}

export function YesNoPrompt(props: YesNoPromptProps): JSX.Element {
  return (
    <div>
      <Text style={{ fontSize: 25 }}>{props.text}</Text>
      <Center>
        <div style={{ display: 'flex', padding: 20 }}>
          <button onClick={props.yes} style={{ minHeight: 50, minWidth: 50, marginRight: 10 }}>{props.yesText || 'Yes'}</button>
          <button onClick={props.no} style={{ minHeight: 50, minWidth: 50 }}>{props.noText || 'No'}</button>
        </div>
      </Center>
    </div>
  );
};