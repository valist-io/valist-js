import { Box, Center, Text } from '@mantine/core';
import useStyles from './Tag.styles';

export interface TagProps {
  label: string;
}

export function Tag(props: TagProps) {
  const { classes } = useStyles();
  return (
    <Box className={classes.root}>
      <Center>
        <Text size={12} transform="capitalize">
          {props.label}
        </Text>
      </Center>
    </Box>
  );
}