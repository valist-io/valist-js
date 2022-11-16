import { 
  Box,
  createPolymorphicComponent,
} from '@mantine/core';

import {
  MantineNumberSize,
  useComponentDefaultProps,
} from '@mantine/styles';

import { forwardRef } from 'react';
import useStyles from './Image.styles';

export interface ImageProps {
  src?: string | null;
  alt?: string;
  width?: number | string;
  height?: number | string;
  radius?: MantineNumberSize;
  layout?: string;
  children?: React.ReactNode;
}

const defaultProps: Partial<ImageProps> = {
  width: '100%',
  height: 'auto',
  layout: 'fill',
  radius: 0,
};

const _Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {
  const {
    src,
    alt,
    radius,
    width,
    height,
    children,
    ...others
  } = useComponentDefaultProps('_Image', defaultProps, props);

  const { classes, cx } = useStyles({ radius });

  return (
    <div style={{ position: 'relative', width, height }}>
      <Box
        component="img"
        className={classes.image}
        ref={ref}
        src={src}
        alt={alt}
        {...others}
      >
        {children}
      </Box>
    </div>
  );
});

export const Image = createPolymorphicComponent<'img', ImageProps>(_Image);