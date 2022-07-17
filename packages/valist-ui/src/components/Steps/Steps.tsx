import { Stepper } from "@mantine/core";
import useStyles from './Steps.styles';

export interface StepsProps {
  active: number,
  steps: string[];
  orientation: 'horizontal' | 'vertical';
};

export function Steps(props: StepsProps):JSX.Element {
  const { classes } = useStyles();

  return (
    <Stepper 
      active={props.active}
      classNames={classes}
      orientation={props.orientation}
      breakpoint="md"
    >
      {props?.steps?.map((item) =>
        <Stepper.Step 
          label={item}
        />
      )}
    </Stepper>
  );
};