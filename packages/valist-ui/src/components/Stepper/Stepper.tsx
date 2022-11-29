import { Stepper as _Stepper, Button, Group, Title, Center } from '@mantine/core';

export type Step = {
  label: string;
  description: string;
  text: string;
}

interface StepperProps {
  active: number;
  setActive: (value: number) => void;
  steps: Step[];
  completed: string;
}

export function Stepper(props: StepperProps): JSX.Element {
  return (
    <>
      <_Stepper active={props.active} onStepClick={props.setActive} breakpoint="sm">
        {props.steps.map((step, index) => (
          <_Stepper.Step key={step.label + index} label={step.label} description={step.description}>
            <Center><Title my="lg" order={2}>{step.text}</Title> </Center>
          </_Stepper.Step>
        ))}
        <_Stepper.Completed>
          <Center><Title my="lg" order={2}>{props.completed}</Title></Center>
        </_Stepper.Completed>
      </_Stepper>
    </>
  );
}
