import { createStyles } from '@mantine/styles';

export interface LinkStyleProps {
  active: boolean;
}

export default createStyles((theme, params: LinkStyleProps) => {
  const active = {
    paddingLeft: 25,
    borderLeft: `5px solid ${theme.colors.purple[3]}`,
    backgroundColor: theme.colors.purple[0],
  };

  const color = params.active
    ? theme.colors.purple[3]
    : theme.colorScheme === 'dark'
    ? theme.colors.gray[2]
    : theme.colors.gray[3];

  return {
    link: {
      display: 'flex',
      padding: '14px 0 14px 30px',
      width: '100%',
      ...(params.active ? active : {}),
    },
    icon: {
      color: color,
      margin: '0 7px',
    },
    text: {
      color: color,
    },
  };
});