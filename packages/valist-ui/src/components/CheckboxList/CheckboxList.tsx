import { Checkbox } from "@mantine/core";
import useStyles from './CheckboxList.styles';

export interface CheckboxListProps {
  items: {
    label: string, 
    checked: boolean,
  }[];
};

export function CheckboxList(props: CheckboxListProps):JSX.Element {
  const { classes } = useStyles();

  return (
    <>
      {props?.items?.map((item, index) => 
        <Checkbox
          key={index}
          label={item.label}
          checked={item.checked}
          classNames={classes}
          radius="lg"
          readOnly
        />
      )}
    </>
  );
};