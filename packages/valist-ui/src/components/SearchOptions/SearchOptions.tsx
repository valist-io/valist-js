import { Badge, Select, useMantineTheme } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import useStyles from './SearchOptions.styles';

interface SearchOptionsProps {
  order: string,
  searchType: "projects" | "accounts";
  projectCount: number;
  accountCount: number;
  setSearchType: (value: any) => void;
  setOrder: (value: any) => void;
}

export function SearchOptions(props:SearchOptionsProps): JSX.Element {
  const theme = useMantineTheme();
  const btnHighlightColor = theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3];
  const accountActiveColor = props.searchType === 'accounts' ? "#5850EC" : btnHighlightColor;
  const projectActiveColor = props.searchType === 'projects' ? "#5850EC" : btnHighlightColor;
  const { classes } = useStyles();

  return (
    <div style={{ fontSize: 24, marginBottom: 32 }}>
      <Badge
        size="xl"
        onClick={() => props.setSearchType("projects")} 
        style={{ marginRight: 12, backgroundColor: projectActiveColor }}
      >
        Projects ({props.projectCount})
      </Badge>
      <Badge
        size="xl"
        onClick={() => props.setSearchType("accounts")}
        style={{ backgroundColor: accountActiveColor }}>
          Accounts ({props.accountCount})
      </Badge>
        <Select
          className={classes.orderSelect}
          value={props.order}
          data={[ 
            { value: 'desc', label: 'Newest' },
            { value: 'asc', label: 'Oldest' },
          ]}
          onChange={(value) => props.setOrder(value || '')}
        />
    </div>
  );
}