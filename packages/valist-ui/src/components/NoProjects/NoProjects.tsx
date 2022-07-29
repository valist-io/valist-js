import { Card, Center, Text } from "@mantine/core";
import { Button } from "../Button";

interface NoProjectProps {
  action: () => void;
}

export function NoProjects(props: NoProjectProps) {
  return (
    <Card style={{display: 'flex', verticalAlign: 'center', alignItems: 'center', width: '100%'}}>
      <div style={{margin: '0 auto'}}>
        <Center><img style={{height: 240, width: 240}} src='/images/packages.png' /></Center>
        <Center><Text style={{fontSize: 24}}>No projects created</Text></Center>
        <Center><Text style={{fontSize: 16, maxWidth: 450, margin: '16px 0 32px 0'}}>
          You have no projects created on your account, you can click the button below to host your first project in a few clicks
        </Text></Center>
        <Center><Button onClick={props.action} style={{marginBottom: 44}}>Create Project</Button></Center>
      </div>
    </Card>
  );
};