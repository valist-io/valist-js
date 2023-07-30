import { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = {
  fontFamily: 'Aktiv Grotesk Corp',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  primaryColor: 'gray',
  primaryShade: {
    light: 1,
    dark: 9,
  },
  defaultRadius: 4,
  headings: {
    fontFamily: 'Aktiv Grotesk Corp',
    fontWeight: 700,
    sizes: {
      h1: {
        fontSize: "2.125rem",
        lineHeight: 1.3,
      },
      h2: {
        fontSize: "1.625rem",
        lineHeight: 1.35,
      },
      h3: {
        fontSize: "1.375rem",
        lineHeight: 1.4,
      },
      h4: {
        fontSize: "1.125rem",
        lineHeight: 1.45,
      },
      h5: {
        fontSize: "1rem",
        lineHeight: 1.5,
      },
      h6: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
    },
  },
  fontSizes: {
    lg: "1.125rem",
    md: "1rem",
    sm: "0.875rem",
    xl: "1.25rem",
    xs: "0.75rem",
  },
  colors: {
    'green': [
      '#F0F5EA',
      '#E8F1DF',
      '#D0E1BD',
      '#669F2A',
      '#5C8F26',
      '#527F22',
      '#4D7720',
      '#3D5F19',
      '#2E4813',
      '#24380F',
    ],
    'red': [
      '#FEECEB',
      '#FDE3E1',
      '#FAC5C1',
      '#F04438',
      '#D83D32',
      '#C0362D',
      '#B4332A',
      '#902922',
      '#6C1F19',
      '#541814',
    ],
    'yellow': [
      '#FEF4E6',
      '#FEEEDA',
      '#FDDDB3',
      '#F79009',
      '#DE8208',
      '#C67307',
      '#B96C07',
      '#945605',
      '#6F4104',
      '#563203',
    ],
    'purple': [
      '#EEEEFD',
      '#DEDCFB',
      '#CBC9F9',
      '#5850EC',
      '#4F48D4',
      '#4640BD',
      '#423CB1',
      '#35308E',
      '#28246A',
      '#1F1C53'
    ],
    'gray': [
      '#F8F8FD',
      '#EBEBF6',
      '#D8D8E5',
      '#9B9BB1',
      '#7A7A92',
      '#54546B',
      '#1E1D26',
      '#111016',
      '#111016',
      '#030111'
    ],
    'dark': [
      '#F8F8FD',
      '#EBEBF6',
      '#D8D8E5',
      '#9B9BB1',
      '#7A7A92',
      '#54546B',
      '#1E1D26',
      '#111016',
      '#111016',
      '#030111'
    ]
  },
}