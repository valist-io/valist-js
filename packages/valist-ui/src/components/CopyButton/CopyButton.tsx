import { Clipboard } from 'tabler-icons-react';
import { Button, useMantineTheme } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";

interface CopyButtonProps {
  value: string;
}

export function CopyButton(props: CopyButtonProps): JSX.Element {
  const clipboard = useClipboard({ timeout: 500 });
  const theme = useMantineTheme();
	const iconColor = theme.colorScheme === 'dark' ? 'white' : theme.colors.dark[9];

  return (
    <Button
      style={{
        backgroundColor: clipboard.copied ? 'rgb(99 102 241)' : '', 
      }}
      sx={() => ({
        '&:hover': {
          backgroundColor: 'transparent',
        },
      })}
      onClick={() => clipboard.copy(props.value)}
    >
      <Clipboard size={18} color={iconColor} />
    </Button>
  );
}