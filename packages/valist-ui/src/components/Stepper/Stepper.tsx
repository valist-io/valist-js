import { Stepper as _Stepper, Button, Group } from '@mantine/core';

export type Step = {
  label: string;
  description: string;
  text: string;
}

interface StepperProps {
  active: number;
  setActive: (value: number) => void;
  steps: Step[];
}

export function Stepper(props: StepperProps): JSX.Element {
  const totalSteps = props.steps.length;
  const nextStep = props.active + 1;
  const prevStep = props.active - 1;

  const next = () => props.setActive(nextStep < totalSteps ? nextStep : props.active);
  const prev = () => props.setActive(prevStep > 0 ? prevStep : props.active);

  return (
    <>
      <_Stepper active={props.active} onStepClick={props.setActive} breakpoint="sm">
        {props.steps.map((step) => (
          <_Stepper.Step label={step.label} description={step.description}>
            {step.text}
          </_Stepper.Step>
        ))}
      </_Stepper>

      <Group position="center" mt="xl">
        <Button variant="default" onClick={prev}>Back</Button>
        <Button onClick={next}>Next step</Button>
      </Group>
    </>
  );
}
