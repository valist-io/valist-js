import { UnstyledButton } from '@mantine/core';

import { forwardRef } from 'react';
import type { Icon } from 'tabler-icons-react';
import useStyles from './CircleButton.styles';

export interface CircleButtonProps {
  icon: Icon;
  label: string;
  className?: string;
  onClick?: () => void;
}

export const CircleButton = forwardRef<HTMLButtonElement, CircleButtonProps>((props, ref) => {
  const { icon: _Icon, label, className, ...rest } = props;
  const { cx, classes } = useStyles();

  return (
    <UnstyledButton 
      ref={ref}
      className={cx(classes.root, className)}
      {...rest}
    >
      <_Icon size={18} />
    </UnstyledButton>
  );
});
