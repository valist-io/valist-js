import { useMantineColorScheme } from '@mantine/core';
import { Sun, MoonStars } from 'tabler-icons-react';
import { CircleButton } from '../CircleButton';

export function ThemeButton() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <CircleButton
      onClick={() => toggleColorScheme()}
      label="Toggle color scheme"
      icon={colorScheme === 'dark' ? Sun : MoonStars}
    />
  );
}