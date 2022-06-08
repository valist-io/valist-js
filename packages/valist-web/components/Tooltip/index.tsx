import { AlertCircle as AlertCircleIcon } from 'tabler-icons-react';
import { Tooltip as MantineTooltip } from "@mantine/core";
interface TooltipProps {
  text: string;
}

export default function Tooltip(props: TooltipProps): JSX.Element {
  return (
    <MantineTooltip label={ props.text } >
      <AlertCircleIcon size={16} style={{ display: 'block', opacity: 0.5 }} />
    </MantineTooltip>
  );
};